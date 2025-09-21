#!/usr/bin/env node

/**
 * MyBeing Cost Monitoring Script
 * Tracks and estimates monthly costs across all services
 */

const fs = require('fs');
const path = require('path');

// Service pricing (as of 2024)
const PRICING = {
  vercel: {
    free: {
      bandwidth: 100, // GB
      buildMinutes: 6000, // minutes
      functionInvocations: 500000,
      edgeRequests: 1000000
    },
    paid: {
      bandwidth: 0.15, // per GB over free
      buildMinutes: 0.005, // per minute over free
      functionInvocations: 0.0000002, // per invocation
      edgeRequests: 0.0000005 // per request
    }
  },
  supabase: {
    free: {
      databaseSize: 0.5, // GB
      storageSize: 1, // GB
      monthlyActiveUsers: 50000
    },
    paid: {
      databaseSize: 0.125, // per GB over free
      storageSize: 0.021, // per GB over free
      monthlyActiveUsers: 0.00325 // per MAU over free
    }
  },
  openai: {
    'gpt-4o-mini': 0.0006, // per 1K tokens
    'gpt-4o': 0.005, // per 1K tokens
    embedding: 0.00002 // per 1K tokens
  },
  resend: {
    free: 100, // emails per day
    paid: 0.001 // per email over free
  }
};

class CostMonitor {
  constructor() {
    this.usageFile = path.join(process.cwd(), '.usage.json');
    this.ensureUsageFile();
  }

  ensureUsageFile() {
    if (!fs.existsSync(this.usageFile)) {
      fs.writeFileSync(this.usageFile, JSON.stringify({
        vercel: { bandwidth: 0, buildMinutes: 0, functionInvocations: 0, edgeRequests: 0 },
        supabase: { databaseSize: 0, storageSize: 0, monthlyActiveUsers: 0 },
        openai: { tokens: 0, requests: 0 },
        resend: { emails: 0 },
        lastUpdated: new Date().toISOString()
      }, null, 2));
    }
  }

  getUsage() {
    return JSON.parse(fs.readFileSync(this.usageFile, 'utf8'));
  }

  updateUsage(service, metric, value) {
    const usage = this.getUsage();
    usage[service][metric] = value;
    usage.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.usageFile, JSON.stringify(usage, null, 2));
  }

  calculateCosts() {
    const usage = this.getUsage();
    const costs = {};

    // Vercel costs
    const vercelUsage = usage.vercel;
    const vercelFree = PRICING.vercel.free;
    costs.vercel = {
      bandwidth: Math.max(0, (vercelUsage.bandwidth - vercelFree.bandwidth) * PRICING.vercel.paid.bandwidth),
      buildMinutes: Math.max(0, (vercelUsage.buildMinutes - vercelFree.buildMinutes) * PRICING.vercel.paid.buildMinutes),
      functionInvocations: Math.max(0, (vercelUsage.functionInvocations - vercelFree.functionInvocations) * PRICING.vercel.paid.functionInvocations),
      edgeRequests: Math.max(0, (vercelUsage.edgeRequests - vercelFree.edgeRequests) * PRICING.vercel.paid.edgeRequests),
      total: 0
    };
    costs.vercel.total = Object.values(costs.vercel).reduce((sum, cost) => sum + cost, 0);

    // Supabase costs
    const supabaseUsage = usage.supabase;
    const supabaseFree = PRICING.supabase.free;
    costs.supabase = {
      databaseSize: Math.max(0, (supabaseUsage.databaseSize - supabaseFree.databaseSize) * PRICING.supabase.paid.databaseSize),
      storageSize: Math.max(0, (supabaseUsage.storageSize - supabaseFree.storageSize) * PRICING.supabase.paid.storageSize),
      monthlyActiveUsers: Math.max(0, (supabaseUsage.monthlyActiveUsers - supabaseFree.monthlyActiveUsers) * PRICING.supabase.paid.monthlyActiveUsers),
      total: 0
    };
    costs.supabase.total = Object.values(costs.supabase).reduce((sum, cost) => sum + cost, 0);

    // OpenAI costs
    const openaiUsage = usage.openai;
    costs.openai = {
      gpt4oMini: openaiUsage.tokens * PRICING.openai['gpt-4o-mini'],
      total: openaiUsage.tokens * PRICING.openai['gpt-4o-mini']
    };

    // Resend costs
    const resendUsage = usage.resend;
    const resendFree = PRICING.resend.free * 30; // daily to monthly
    costs.resend = {
      emails: Math.max(0, (resendUsage.emails - resendFree) * PRICING.resend.paid),
      total: 0
    };
    costs.resend.total = costs.resend.emails;

    // Total costs
    costs.total = costs.vercel.total + costs.supabase.total + costs.openai.total + costs.resend.total;

    return costs;
  }

  generateReport() {
    const usage = this.getUsage();
    const costs = this.calculateCosts();

    console.log('\n📊 MyBeing Cost Report');
    console.log('========================');
    console.log(`Last Updated: ${new Date(usage.lastUpdated).toLocaleString()}`);
    console.log(`\n💰 Estimated Monthly Costs:`);
    console.log(`Total: $${costs.total.toFixed(2)}`);
    
    if (costs.total === 0) {
      console.log('\n✅ Currently within all free tiers!');
    }

    console.log('\n📈 Service Breakdown:');
    console.log(`Vercel: $${costs.vercel.total.toFixed(2)}`);
    console.log(`Supabase: $${costs.supabase.total.toFixed(2)}`);
    console.log(`OpenAI: $${costs.openai.total.toFixed(2)}`);
    console.log(`Resend: $${costs.resend.total.toFixed(2)}`);

    // Usage warnings
    console.log('\n⚠️  Usage Alerts:');
    
    const vercelUsage = usage.vercel;
    const vercelFree = PRICING.vercel.free;
    if (vercelUsage.bandwidth > vercelFree.bandwidth * 0.8) {
      console.log(`- Vercel bandwidth: ${vercelUsage.bandwidth}/${vercelFree.bandwidth} GB (80% used)`);
    }
    
    const supabaseUsage = usage.supabase;
    const supabaseFree = PRICING.supabase.free;
    if (supabaseUsage.databaseSize > supabaseFree.databaseSize * 0.8) {
      console.log(`- Supabase DB: ${supabaseUsage.databaseSize}/${supabaseFree.databaseSize} GB (80% used)`);
    }

    return { usage, costs };
  }

  simulateGrowth(users) {
    console.log(`\n🚀 Growth Simulation: ${users} users`);
    console.log('=====================================');

    // Simulate typical usage patterns
    const simulatedUsage = {
      vercel: {
        bandwidth: users * 0.5, // 500MB per user per month
        buildMinutes: 100, // fixed
        functionInvocations: users * 100, // 100 per user per month
        edgeRequests: users * 1000 // 1000 per user per month
      },
      supabase: {
        databaseSize: Math.min(users * 0.001, 0.5), // 1MB per user, capped
        storageSize: users * 0.01, // 10MB per user
        monthlyActiveUsers: users
      },
      openai: {
        tokens: users * 5000, // 5K tokens per user per month
        requests: users * 10 // 10 requests per user per month
      },
      resend: {
        emails: users * 5 // 5 emails per user per month
      }
    };

    // Temporarily update usage
    const originalUsage = this.getUsage();
    fs.writeFileSync(this.usageFile, JSON.stringify(simulatedUsage, null, 2));
    
    const simulatedCosts = this.calculateCosts();
    
    console.log(`Estimated monthly cost for ${users} users: $${simulatedCosts.total.toFixed(2)}`);
    console.log(`Cost per user: $${(simulatedCosts.total / users).toFixed(3)}`);

    // Restore original usage
    fs.writeFileSync(this.usageFile, JSON.stringify(originalUsage, null, 2));
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new CostMonitor();
  const command = process.argv[2];

  switch (command) {
    case 'report':
      monitor.generateReport();
      break;
    case 'simulate':
      const users = parseInt(process.argv[3]) || 100;
      monitor.simulateGrowth(users);
      break;
    default:
      console.log('Usage:');
      console.log('  node cost-monitor.js report     - Show current cost report');
      console.log('  node cost-monitor.js simulate 100 - Simulate costs for 100 users');
  }
}

module.exports = CostMonitor;

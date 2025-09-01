'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  premiumArticlesLimit: number;
  isPopular?: boolean;
}

interface PromoCode {
  code: string;
  discountPercentage: number;
  validUntil: Date;
  maxUses: number;
  currentUses: number;
  description: string;
  isActive: boolean;
}

export function PricingManager() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discountPercentage: 0,
    validUntil: '',
    maxUses: 100,
    description: ''
  });

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      setPlans(data.plans);
      setPromoCodes(data.promoCodes);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    }
  };

  const updatePlanPrice = async (planId: string, newPrice: number) => {
    try {
      const response = await fetch('/api/admin/pricing/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, newPrice })
      });

      if (response.ok) {
        loadPricingData();
        setEditingPlan(null);
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const createPromoCode = async () => {
    try {
      const response = await fetch('/api/admin/pricing/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPromo,
          validUntil: new Date(newPromo.validUntil),
          isActive: true
        })
      });

      if (response.ok) {
        loadPricingData();
        setNewPromo({
          code: '',
          discountPercentage: 0,
          validUntil: '',
          maxUses: 100,
          description: ''
        });
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
    }
  };

  const togglePromoStatus = async (code: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/pricing/promo/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, isActive })
      });

      if (response.ok) {
        loadPricingData();
      }
    } catch (error) {
      console.error('Error toggling promo status:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Pricing Plans Management */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Plans Management</CardTitle>
          <p className="text-sm text-gray-600">
            💡 Based on Reddit research: Users prefer $15-25/month. BetterHelp ($65/month) gets complaints about pricing.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map(plan => (
              <div key={plan.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                  {plan.isPopular && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Popular
                    </span>
                  )}
                </div>
                
                <div className="mb-3">
                  {editingPlan?.id === plan.id ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">$</span>
                      <input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({
                          ...editingPlan,
                          price: Number(e.target.value)
                        })}
                        className="w-20 px-2 py-1 border rounded text-lg font-bold"
                      />
                      <span className="text-sm text-gray-500">/{plan.interval}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">${plan.price}</span>
                      <span className="text-sm text-gray-500">/{plan.interval}</span>
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  {plan.premiumArticlesLimit} premium articles/month
                </div>

                <div className="flex space-x-2">
                  {editingPlan?.id === plan.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updatePlanPrice(plan.id, editingPlan.price)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPlan(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPlan(plan)}
                    >
                      Edit Price
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promotional Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Promotional Codes</CardTitle>
          <p className="text-sm text-gray-600">
            Create and manage discount codes to boost conversions
          </p>
        </CardHeader>
        <CardContent>
          {/* Create New Promo */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-4">Create New Promo Code</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Promo Code"
                value={newPromo.code}
                onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Discount %"
                value={newPromo.discountPercentage}
                onChange={(e) => setNewPromo({...newPromo, discountPercentage: Number(e.target.value)})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="date"
                value={newPromo.validUntil}
                onChange={(e) => setNewPromo({...newPromo, validUntil: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max Uses"
                value={newPromo.maxUses}
                onChange={(e) => setNewPromo({...newPromo, maxUses: Number(e.target.value)})}
                className="px-3 py-2 border rounded"
              />
            </div>
            <input
              type="text"
              placeholder="Description"
              value={newPromo.description}
              onChange={(e) => setNewPromo({...newPromo, description: e.target.value})}
              className="w-full px-3 py-2 border rounded mt-4"
            />
            <Button onClick={createPromoCode} className="mt-4">
              Create Promo Code
            </Button>
          </div>

          {/* Active Promo Codes */}
          <div className="space-y-3">
            {promoCodes.map(promo => (
              <div key={promo.code} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                      {promo.code}
                    </code>
                    <span className="font-medium">{promo.discountPercentage}% off</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {promo.description} • Used {promo.currentUses}/{promo.maxUses} times
                  </div>
                  <div className="text-xs text-gray-500">
                    Valid until {new Date(promo.validUntil).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePromoStatus(promo.code, !promo.isActive)}
                >
                  {promo.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Strategy Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Pricing Strategy Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Market Research (Reddit Feedback)</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• <strong>Headspace/Calm:</strong> $12-15/month (well-received)</li>
                <li>• <strong>BetterHelp:</strong> $65/month (many complaints)</li>
                <li>• <strong>Sweet spot:</strong> $15-25/month for self-help apps</li>
                <li>• <strong>User preference:</strong> Lower entry price with upgrades</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Recommended Strategy</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Start with <strong>$19/month</strong> basic plan</li>
                <li>• Offer <strong>50% launch discount</strong> for first 100 users</li>
                <li>• Create <strong>yearly plans</strong> with significant savings</li>
                <li>• Use <strong>student discounts</strong> to build user base</li>
                <li>• Gradually increase prices as value is proven</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

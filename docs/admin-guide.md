# MyBeing Admin Dashboard - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [User Management](#user-management)
5. [Content Management](#content-management)
6. [Subscription Management](#subscription-management)
7. [AI Chat Management](#ai-chat-management)
8. [System Health Monitoring](#system-health-monitoring)
9. [Reports & Data Export](#reports--data-export)
10. [Security & Settings](#security--settings)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Admin account with appropriate permissions
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection

### Accessing the Admin Dashboard
1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the main dashboard upon successful authentication

### Demo Credentials (Development Only)
- **Email**: admin@mybeing.com
- **Password**: admin123
- **Role**: super_admin

> ⚠️ **Important**: Demo credentials are only available in development mode and should never be used in production.

---

## Authentication

### Role-Based Access Control
The admin system supports three permission levels:

#### Super Admin
- Full access to all features
- User management capabilities
- System configuration access
- Data export permissions

#### Admin
- Content management
- User support functions
- Basic analytics access
- Limited system monitoring

#### Moderator
- Content review and moderation
- User support
- Basic reporting access

### Session Management
- Sessions expire after 24 hours of inactivity
- Automatic logout on browser close (secure environments)
- Multi-device session support

---

## Dashboard Overview

The main dashboard provides a comprehensive overview of platform metrics and activities.

### Key Metrics Cards
- **Total Users**: Current registered user count with growth trends
- **Active Subscriptions**: Premium subscribers with conversion rates
- **Total Quizzes**: Available assessments and completion rates
- **AI Conversations**: Chat interactions and engagement metrics
- **Monthly Revenue**: Financial performance and trends
- **System Uptime**: Platform reliability metrics

### Real-Time System Health
Monitor critical system resources:
- **CPU Usage**: Server processing load
- **Memory Usage**: RAM consumption
- **Storage Usage**: Disk space utilization
- **Response Time**: API performance metrics

### Recent Activity Feed
Track platform activity in real-time:
- New user registrations
- Subscription activations
- Quiz completions
- AI chat sessions

### Quick Actions
Access common administrative tasks:
- Manage Users
- Create Quiz
- AI Settings
- Export Data

---

## User Management

### User Overview
Access comprehensive user information including:
- Registration details
- Subscription status
- Activity history
- Quiz completion records
- AI chat usage

### User Actions
- **View Profile**: Detailed user information
- **Edit Details**: Update user information
- **Manage Subscription**: Modify subscription status
- **Send Message**: Direct communication
- **Suspend Account**: Temporary access restriction
- **Delete Account**: Permanent removal (with data retention policies)

### Bulk Operations
- Export user data
- Send bulk notifications
- Apply subscription changes
- Generate user reports

---

## Content Management

### Quiz Management
- **Create New Quizzes**: Design psychological assessments
- **Edit Existing Quizzes**: Modify questions and scoring
- **Preview Mode**: Test quiz experience
- **Analytics**: Track completion rates and user feedback

### Article Management
- **Content Creation**: Rich text editor with media support
- **SEO Optimization**: Meta tags and search optimization
- **Publication Scheduling**: Automated content release
- **Performance Tracking**: Engagement metrics

### Media Library
- **File Upload**: Images, videos, documents
- **Organization**: Folders and tagging system
- **Optimization**: Automatic compression and formatting
- **CDN Integration**: Fast global content delivery

---

## Subscription Management

### Subscription Overview
Monitor the premium subscription system:
- **Active Subscriptions**: Current paying users
- **Revenue Tracking**: Monthly and annual metrics
- **Churn Analysis**: Cancellation patterns
- **Growth Trends**: Subscription acquisition rates

### Individual Subscription Management
- **View Details**: Payment history and status
- **Modify Plans**: Upgrade/downgrade options
- **Process Refunds**: Customer service actions
- **Update Payment**: Credit card and billing information

### Premium Features Tracking
- **Quiz Access**: Premium assessment usage
- **AI Conversations**: Unlimited chat feature usage
- **Content Access**: Premium article engagement
- **Progress Tracking**: Advanced analytics usage

---

## AI Chat Management

### Conversation Monitoring
- **Active Sessions**: Real-time chat monitoring
- **Usage Analytics**: Conversation volume and patterns
- **User Feedback**: Rating and satisfaction metrics
- **Performance Metrics**: Response time and accuracy

### AI Configuration
- **Model Settings**: GPT-4 parameters and behavior
- **Response Templates**: Predefined conversation starters
- **Safety Filters**: Content moderation settings
- **Rate Limiting**: Usage restrictions and quotas

### Quality Assurance
- **Conversation Review**: Sample chat analysis
- **Feedback Integration**: User rating incorporation
- **Continuous Improvement**: Model fine-tuning based on data

---

## System Health Monitoring

### Performance Metrics
Real-time monitoring of critical system components:

#### Server Resources
- **CPU Usage**: Processing load with alerts at 80%+
- **Memory Usage**: RAM consumption with optimization recommendations
- **Storage Usage**: Disk space with cleanup suggestions
- **Network Performance**: Bandwidth utilization and latency

#### Application Performance
- **Response Times**: API endpoint performance
- **Database Performance**: Query optimization metrics
- **Cache Hit Rates**: Caching efficiency
- **Error Rates**: Application stability indicators

### Alert System
- **Threshold Monitoring**: Automated alerts for resource limits
- **Escalation Procedures**: Multi-level notification system
- **Resolution Tracking**: Issue management and follow-up
- **Historical Analysis**: Performance trend analysis

### Maintenance Scheduling
- **Planned Downtime**: Scheduled maintenance windows
- **Update Deployment**: System upgrade procedures
- **Backup Verification**: Data integrity checks
- **Disaster Recovery**: Emergency response protocols

---

## Reports & Data Export

### Available Reports
Generate comprehensive reports for analysis:

#### User Analytics
- **Registration Trends**: User growth patterns
- **Engagement Metrics**: Platform usage statistics
- **Demographics**: User profile analysis
- **Retention Rates**: User lifecycle metrics

#### Content Performance
- **Quiz Analytics**: Completion rates and feedback
- **Article Engagement**: Reading patterns and sharing
- **AI Chat Usage**: Conversation volume and satisfaction
- **Search Analytics**: Content discovery patterns

#### Financial Reports
- **Revenue Analysis**: Subscription income tracking
- **Conversion Metrics**: Free-to-paid user conversion
- **Churn Analysis**: Subscription cancellation patterns
- **Lifetime Value**: Customer value calculations

### Export Formats
- **CSV**: Spreadsheet-compatible data
- **JSON**: Developer-friendly format
- **PDF**: Professional reports
- **Excel**: Advanced analysis capabilities

### Data Privacy
- **Anonymization**: Personal data protection
- **GDPR Compliance**: European privacy regulations
- **Data Retention**: Automated cleanup policies
- **Access Logging**: Export activity tracking

---

## Security & Settings

### Security Features
- **Two-Factor Authentication**: Enhanced login security
- **IP Whitelisting**: Restricted access by location
- **Session Management**: Automatic timeout and security
- **Audit Logging**: Complete activity tracking

### System Configuration
- **Email Settings**: SMTP configuration and templates
- **Payment Integration**: Stripe configuration and webhooks
- **AI Service Settings**: OpenAI API configuration
- **Cache Management**: Redis configuration and optimization

### Backup & Recovery
- **Automated Backups**: Daily database snapshots
- **Point-in-Time Recovery**: Granular data restoration
- **Disaster Recovery**: Multi-region failover
- **Data Integrity**: Verification and validation

---

## Troubleshooting

### Common Issues

#### Login Problems
**Issue**: Cannot access admin dashboard
**Solutions**:
1. Verify credentials are correct
2. Check if account has admin permissions
3. Clear browser cache and cookies
4. Try incognito/private browsing mode
5. Contact system administrator

#### Performance Issues
**Issue**: Dashboard loading slowly
**Solutions**:
1. Check internet connection
2. Clear browser cache
3. Disable browser extensions
4. Try different browser
5. Check system status page

#### Data Export Failures
**Issue**: Export operations timing out
**Solutions**:
1. Reduce date range for large datasets
2. Export in smaller batches
3. Use CSV format for large datasets
4. Schedule exports during off-peak hours
5. Contact technical support

### Error Codes
- **401 Unauthorized**: Invalid or expired authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: System error, contact support

### Support Contacts
- **Technical Support**: tech@mybeing.com
- **System Administrator**: admin@mybeing.com
- **Emergency Contact**: +1-XXX-XXX-XXXX

---

## Best Practices

### Security
- Use strong, unique passwords
- Enable two-factor authentication
- Log out when finished
- Don't share admin credentials
- Report suspicious activity immediately

### Performance
- Close unused browser tabs
- Use modern browsers
- Limit concurrent operations
- Schedule large exports during off-peak hours
- Monitor system resources regularly

### Data Management
- Regular data backups
- Verify export integrity
- Follow data retention policies
- Maintain user privacy
- Document configuration changes

---

## Updates & Changelog

### Version 2.0.0 (Current)
- Enhanced UI with smooth animations
- Real-time system monitoring
- Advanced data export capabilities
- Improved user management
- Glass morphism design updates

### Upcoming Features
- Advanced analytics dashboard
- Automated report scheduling
- Enhanced AI chat customization
- Mobile admin app
- Advanced user segmentation

---

*Last Updated: January 2024*
*For technical support, contact: tech@mybeing.com*

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// Local type for discount management UI (mirrors database shape used in lib/subscription)
interface ManualDiscount {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  itemType: 'quiz' | 'article';
  itemId?: string;
  validFrom: Date;
  validUntil: Date;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
}

interface DiscountManagerProps {
  onCreateDiscount: (discount: Omit<ManualDiscount, 'id' | 'currentUses'>) => void;
  onUpdateDiscount: (id: string, updates: Partial<ManualDiscount>) => void;
}

export function DiscountManager({ onCreateDiscount, onUpdateDiscount }: DiscountManagerProps) {
  const [discounts, setDiscounts] = useState<ManualDiscount[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercent: 10,
    itemType: 'quiz' as 'quiz' | 'article',
    itemId: '',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    maxUses: 100,
    isActive: true
  });

  // In a real implementation, this would fetch from an API
  useEffect(() => {
    // Mock data
    const mockDiscounts: ManualDiscount[] = [
      {
        id: '1',
        code: 'WELCOME10',
        description: 'Welcome discount for new users',
        discountPercent: 10,
        itemType: 'quiz',
        validFrom: new Date('2025-09-01'),
        validUntil: new Date('2025-12-31'),
        maxUses: 1000,
        currentUses: 150,
        isActive: true
      },
      {
        id: '2',
        code: 'LOYALTY20',
        description: 'Loyalty discount for returning users',
        discountPercent: 20,
        itemType: 'article',
        validFrom: new Date('2025-09-01'),
        validUntil: new Date('2025-10-31'),
        maxUses: 500,
        currentUses: 89,
        isActive: true
      }
    ];
    setDiscounts(mockDiscounts);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const discountData = {
      ...formData,
      validFrom: new Date(formData.validFrom),
      validUntil: new Date(formData.validUntil)
    };
    
    if (editingId) {
      onUpdateDiscount(editingId, discountData);
      setEditingId(null);
    } else {
      onCreateDiscount(discountData);
    }
    
    setIsCreating(false);
    setFormData({
      code: '',
      description: '',
      discountPercent: 10,
      itemType: 'quiz',
      itemId: '',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxUses: 100,
      isActive: true
    });
  };

  const handleEdit = (discount: ManualDiscount) => {
    setFormData({
      code: discount.code,
      description: discount.description,
      discountPercent: discount.discountPercent,
      itemType: discount.itemType,
      itemId: discount.itemId || '',
      validFrom: discount.validFrom.toISOString().split('T')[0],
      validUntil: discount.validUntil.toISOString().split('T')[0],
      maxUses: discount.maxUses,
      isActive: discount.isActive
    });
    setEditingId(discount.id);
    setIsCreating(true);
  };

  const toggleDiscountStatus = (id: string, isActive: boolean) => {
    onUpdateDiscount(id, { isActive });
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Discount' : 'Create New Discount'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Type
                  </label>
                  <select
                    value={formData.itemType}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemType: e.target.value as 'quiz' | 'article' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="article">Article</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Item ID (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.itemId}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Leave blank for all items of type"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUses}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUses: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              
              <div className="flex space-x-3">
                <Button type="submit">
                  {editingId ? 'Update Discount' : 'Create Discount'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({
                      code: '',
                      description: '',
                      discountPercent: 10,
                      itemType: 'quiz',
                      itemId: '',
                      validFrom: new Date().toISOString().split('T')[0],
                      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      maxUses: 100,
                      isActive: true
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Manual Discounts</h3>
        <Button onClick={() => setIsCreating(true)}>
          Create Discount
        </Button>
      </div>
      
      {/* Discounts List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {discounts.map((discount) => (
            <li key={discount.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-purple-600 truncate">
                      {discount.code}
                    </p>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(discount)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleDiscountStatus(discount.id, !discount.isActive)}
                    >
                      {discount.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {discount.description}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <span className="font-medium">{discount.discountPercent}%</span> off {discount.itemType}
                      {discount.itemId && ` (${discount.itemId})`}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Used: {discount.currentUses}/{discount.maxUses}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex text-sm text-gray-500">
                  <p>
                    Valid: {discount.validFrom.toLocaleDateString()} - {discount.validUntil.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {discounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No discounts created yet.</p>
            <Button
              className="mt-4"
              onClick={() => setIsCreating(true)}
            >
              Create Your First Discount
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { QuizData, QuizQuestion } from '@/lib/quiz';

interface QuizManagerProps {
  quizzes: QuizData[];
  onCreateQuiz: (quiz: Omit<QuizData, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => void;
  onUpdateQuiz: (id: string, quiz: Partial<QuizData>) => void;
  onDeleteQuiz: (id: string) => void;
  onTogglePublished: (id: string) => void;
}

export function QuizManager({ quizzes, onCreateQuiz, onUpdateQuiz, onDeleteQuiz, onTogglePublished }: QuizManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    published: false,
    questions: [] as QuizQuestion[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quizData = {
      ...formData,
      slug: generateSlug(formData.title),
      bands: [
        { min: 0, max: 33, label: 'Low', advice: 'Lower range for this assessment.' },
        { min: 34, max: 66, label: 'Moderate', advice: 'Moderate range for this assessment.' },
        { min: 67, max: 100, label: 'High', advice: 'Higher range for this assessment.' }
      ],
      scoringBands: [
        { min: 0, max: 33, label: 'Low', description: 'Lower range for this assessment.' },
        { min: 34, max: 66, label: 'Moderate', description: 'Moderate range for this assessment.' },
        { min: 67, max: 100, label: 'High', description: 'Higher range for this assessment.' }
      ],
      authorId: 'admin'
    };

    if (editingId) {
      onUpdateQuiz(editingId, quizData);
      setEditingId(null);
    } else {
      onCreateQuiz(quizData);
      setIsCreating(false);
    }

    setFormData({
      title: '',
      description: '',
      published: false,
      questions: []
    });
  };

  const handleEdit = (quiz: QuizData) => {
    setFormData({
      title: quiz.title,
      description: quiz.description,
      published: quiz.published,
      questions: quiz.questions
    });
    setEditingId(quiz.id);
    setIsCreating(true);
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q${formData.questions.length + 1}`,
      text: '',
      type: 'multiple-choice',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: true
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? { ...q, ...updates } : q)
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update your quiz details and questions' : 'Add a new assessment to your platform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              {/* Questions Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Questions</h4>
                  <Button type="button" variant="secondary" onClick={addQuestion}>
                    Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Question {index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Text
                          </label>
                          <textarea
                            value={question.text}
                            onChange={(e) => updateQuestion(index, { text: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(index, { type: e.target.value as QuizQuestion['type'] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="scale">Scale (1-5)</option>
                            <option value="text">Text Response</option>
                          </select>
                        </div>

                        {question.type === 'multiple-choice' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Options (one per line)
                            </label>
                            <textarea
                              value={question.options?.join('\n') || ''}
                              onChange={(e) => updateQuestion(index, { options: e.target.value.split('\n').filter(Boolean) })}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                            />
                          </div>
                        )}

                        {question.type === 'scale' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Label
                              </label>
                              <input
                                type="text"
                                value={question.scaleLabels?.min || ''}
                                onChange={(e) => updateQuestion(index, { 
                                  scaleLabels: { ...question.scaleLabels, min: e.target.value, max: question.scaleLabels?.max || '' }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="Never"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Label
                              </label>
                              <input
                                type="text"
                                value={question.scaleLabels?.max || ''}
                                onChange={(e) => updateQuestion(index, { 
                                  scaleLabels: { ...question.scaleLabels, max: e.target.value, min: question.scaleLabels?.min || '' }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="Always"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`required-${index}`}
                            checked={question.required}
                            onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <label htmlFor={`required-${index}`} className="text-sm font-medium text-gray-700">
                            Required question
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No questions added yet. Click "Add Question" to get started.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={formData.questions.length === 0}>
                  {editingId ? 'Update Quiz' : 'Create Quiz'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({
                      title: '',
                      description: '',
                      published: false,
                      questions: []
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

      {/* Create Button */}
      {!isCreating && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Quizzes</h3>
          <Button onClick={() => setIsCreating(true)}>
            <span className="mr-2">🧠</span>
            New Quiz
          </Button>
        </div>
      )}

      {/* Quizzes List */}
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.published 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {quiz.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <CardDescription>{quiz.description}</CardDescription>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>❓ {quiz.questions.length} questions</span>
                    <span>👥 {quiz.responses} responses</span>
                    <span>📅 {quiz.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(quiz)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onTogglePublished(quiz.id)}
                >
                  {quiz.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteQuiz(quiz.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
            <p className="text-gray-600 mb-4">Create your first assessment to get started</p>
            <Button onClick={() => setIsCreating(true)}>
              Create First Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

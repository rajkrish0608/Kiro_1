import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { Textarea } from '../components/ui/Textarea/Textarea';
import { Select } from '../components/ui/Select/Select';
import { Button } from '../components/ui/Button/Button';
import { ApiError } from '../services/api';
import type { CreatePostData } from '../types/post';

export function CreatePost() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreatePostData>({
        title: '',
        content: '',
        communityId: '',
        tags: [],
        isEncrypted: false,
    });
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock communities - in real app, fetch from API
    const communities = [
        { value: '', label: 'Select a community (optional)' },
        { value: '1', label: 'Workplace Issues' },
        { value: '2', label: 'Government Corruption' },
        { value: '3', label: 'Corporate Misconduct' },
        { value: '4', label: 'Healthcare' },
        { value: '5', label: 'Education' },
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 10) {
            newErrors.title = 'Title must be at least 10 characters';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (!formData.content) {
            newErrors.content = 'Content is required';
        } else if (formData.content.length < 10) {
            newErrors.content = 'Content must be at least 10 characters';
        } else if (formData.content.length > 10000) {
            newErrors.content = 'Content must be less than 10,000 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const postData: CreatePostData = {
                title: formData.title,
                content: formData.content,
                tags: formData.tags,
                isEncrypted: formData.isEncrypted,
            };

            if (formData.communityId) {
                postData.communityId = formData.communityId;
            }

            const post = await postService.createPost(postData);
            navigate(`/post/${post.id}`);
        } catch (err) {
            if (err instanceof ApiError) {
                setErrors({ submit: err.message });
            } else {
                setErrors({ submit: 'Failed to create post. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags?.includes(tag) && (formData.tags?.length || 0) < 10) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), tag],
            });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-6)' }}>
                Create Post
            </h1>

            <Card padding="lg">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {/* Community Selection */}
                        <Select
                            label="Community"
                            options={communities}
                            value={formData.communityId}
                            onChange={(e) => setFormData({ ...formData, communityId: e.target.value })}
                            helperText="Choose a community for your post"
                        />

                        {/* Title */}
                        <Input
                            label="Title"
                            placeholder="Enter a descriptive title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            error={errors.title}
                            helperText={`${formData.title.length}/200 characters`}
                        />

                        {/* Content */}
                        <Textarea
                            label="Content"
                            placeholder="Share your story... Be as detailed as possible."
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            error={errors.content}
                            helperText={`${formData.content.length}/10,000 characters`}
                            rows={10}
                        />

                        {/* Tags */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 'var(--space-2)' }}>
                                Tags
                            </label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <Input
                                    placeholder="Add tags (press Enter)"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button type="button" variant="secondary" onClick={handleAddTag}>
                                    Add
                                </Button>
                            </div>
                            {formData.tags && formData.tags.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                padding: 'var(--space-2) var(--space-3)',
                                                background: 'var(--bg-tertiary)',
                                                border: '1px solid var(--border-default)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: 'var(--text-sm)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                            }}
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    fontSize: 'var(--text-lg)',
                                                }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                Add up to 10 tags to help others find your post
                            </span>
                        </div>

                        {/* Encryption Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                            <input
                                type="checkbox"
                                id="encryption"
                                checked={formData.isEncrypted}
                                onChange={(e) => setFormData({ ...formData, isEncrypted: e.target.checked })}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="encryption" style={{ cursor: 'pointer', flex: 1 }}>
                                <div style={{ fontWeight: 500, marginBottom: 'var(--space-1)' }}>
                                    Enable Client-Side Encryption
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    Your content will be encrypted before being sent to the server
                                </div>
                            </label>
                        </div>

                        {/* Error Message */}
                        {errors.submit && (
                            <div
                                style={{
                                    padding: 'var(--space-3)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid var(--status-error)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--status-error)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                {errors.submit}
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate(-1)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" loading={isSubmitting}>
                                Create Post
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}

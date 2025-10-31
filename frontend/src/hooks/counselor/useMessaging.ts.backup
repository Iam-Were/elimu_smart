import { useState } from 'react';
import Parse from 'parse';

interface BulkMessageParams {
  studentIds: string[];
  message: string;
  subject?: string;
}

interface MessageTemplate {
  id?: string;
  title: string;
  content: string;
  category?: string;
  placeholders?: string[];
}

export const useMessaging = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send bulk message to multiple students
   */
  const sendBulkMessage = async (params: BulkMessageParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('sendBulkMessage', params);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send bulk message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create message template
   */
  const createMessageTemplate = async (template: MessageTemplate) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('createMessageTemplate', template);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get message templates
   */
  const getMessageTemplates = async (category?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('getMessageTemplates', { category });
      return result.templates || [];
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get templates';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update message template
   */
  const updateMessageTemplate = async (
    templateId: string,
    updates: Partial<MessageTemplate>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('updateMessageTemplate', {
        templateId,
        ...updates
      });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete message template
   */
  const deleteMessageTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await Parse.Cloud.run('deleteMessageTemplate', { templateId });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send message to all assigned students (convenience method)
   */
  const sendToAllStudents = async (_message: string, _subject?: string) => {
    // This would need to fetch all assigned students first
    // For now, it's a placeholder
    throw new Error('Not implemented - use sendBulkMessage with specific student IDs');
  };

  return {
    isLoading,
    error,
    sendBulkMessage,
    createMessageTemplate,
    getMessageTemplates,
    updateMessageTemplate,
    deleteMessageTemplate,
    sendToAllStudents
  };
};

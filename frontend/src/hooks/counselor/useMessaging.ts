import { useState } from 'react';
import { getParse } from '@/config/parse';

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
      const Parse = await getParse();
      const result = await Parse.Cloud.run('sendBulkMessage', params);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send bulk message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new message template
   */
  const createMessageTemplate = async (template: MessageTemplate) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('createMessageTemplate', template);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get all message templates
   */
  const getMessageTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getMessageTemplates');
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch templates');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing message template
   */
  const updateMessageTemplate = async (templateId: string, updates: Partial<MessageTemplate>) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('updateMessageTemplate', {
        templateId,
        ...updates
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to update template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a message template
   */
  const deleteMessageTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      await Parse.Cloud.run('deleteMessageTemplate', { templateId });
    } catch (err: any) {
      setError(err.message || 'Failed to delete template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendBulkMessage,
    createMessageTemplate,
    getMessageTemplates,
    updateMessageTemplate,
    deleteMessageTemplate,
    isLoading,
    error
  };
};

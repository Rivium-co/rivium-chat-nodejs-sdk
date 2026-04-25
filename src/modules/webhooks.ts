import { HttpClient } from '../client';
import { WebhookConfig, SetWebhookOptions, PushTemplates } from '../types';

export class Webhooks {
  constructor(private client: HttpClient) {}

  /** Get current webhook and push configuration. */
  async get(): Promise<WebhookConfig> {
    return this.client.get<WebhookConfig>('/api/v1/webhook');
  }

  /** Set webhook URL (and optional secret for HMAC-SHA256 signature verification). */
  async setWebhook(options: SetWebhookOptions): Promise<{ success: boolean; webhookUrl: string }> {
    return this.client.put<{ success: boolean; webhookUrl: string }>('/api/v1/webhook', options);
  }

  /** Remove webhook configuration. */
  async removeWebhook(): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>('/api/v1/webhook');
  }

  /** Set Pushino template ID for offline push notifications. */
  async setPushTemplate(pushTemplateId: string): Promise<{ success: boolean; pushTemplateId: string }> {
    return this.client.put<{ success: boolean; pushTemplateId: string }>('/api/v1/webhook/push', { pushTemplateId });
  }

  /** Remove push notification template configuration. */
  async removePushTemplate(): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>('/api/v1/webhook/push');
  }

  /** Set per-event push notification config (template ID, inline title/body, or skip). */
  async setPushTemplates(templates: PushTemplates): Promise<{ success: boolean; pushTemplates: PushTemplates }> {
    return this.client.put<{ success: boolean; pushTemplates: PushTemplates }>('/api/v1/webhook/push-templates', templates);
  }

  /** Remove per-event push template configuration. */
  async removePushTemplates(): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>('/api/v1/webhook/push-templates');
  }
}

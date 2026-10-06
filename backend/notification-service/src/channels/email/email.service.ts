import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { providersConfig } from "../../config/providers.config";
import { emailProvider } from "./email.provider";
import { EmailMessage } from "./email.types";

@Injectable()
export class EmailService {
  async send(message: EmailMessage) {
    if (!providersConfig.emailFrom) {
      throw new ServiceUnavailableException("EMAIL_FROM is not configured");
    }
    return emailProvider.send(
      new SendEmailCommand({
        FromEmailAddress: providersConfig.emailFrom,
        Destination: { ToAddresses: [message.recipient] },
        Content: {
          Simple: {
            Subject: { Data: message.subject },
            Body: { Text: { Data: message.body } },
          },
        },
      }),
    );
  }
}

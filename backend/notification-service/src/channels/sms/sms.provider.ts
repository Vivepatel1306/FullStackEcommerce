import { SNSClient } from "@aws-sdk/client-sns";
import { awsConfig } from "../../config/aws.config";

export const smsProvider = new SNSClient({ region: awsConfig.region });

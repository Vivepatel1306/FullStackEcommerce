import { SNSClient } from "@aws-sdk/client-sns";
import { awsConfig } from "../../config/aws.config";

export const pushProvider = new SNSClient({ region: awsConfig.region });

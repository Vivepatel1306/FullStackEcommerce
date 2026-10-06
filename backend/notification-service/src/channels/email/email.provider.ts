import { SESv2Client } from "@aws-sdk/client-sesv2";
import { awsConfig } from "../../config/aws.config";

export const emailProvider = new SESv2Client({ region: awsConfig.region });

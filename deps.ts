export { TextLineStream } from "https://deno.land/std@0.223.0/streams/text_line_stream.ts";
export { parseArgs } from "jsr:@std/cli@^0.223.0";
export {
  GetFunctionConfigurationCommand,
  LambdaClient,
} from "npm:@aws-sdk/client-lambda";

export {
  ListObjectsCommand,
  type ListObjectsCommandOutput,
  S3Client,
} from "npm:@aws-sdk/client-s3";

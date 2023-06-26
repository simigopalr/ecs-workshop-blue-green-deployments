#!/usr/bin/env bash

######################################################################
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. #
# SPDX-License-Identifier: MIT-0                                     #
######################################################################

export AWS_ACCOUNT_ID=117134819170
export AWS_DEFAULT_REGION=ap-southeast-2

cdk bootstrap aws://117134819170/ap-southeast-2

export PIPELINE_NAME=$(aws cloudformation describe-stacks --stack-name BlueGreenPipelineStack --query 'Stacks[*].Outputs[?ExportName==`blueGreenPipeline`].OutputValue' --output text)
echo $PIPELINE_NAME

export EXECUTION_ID=$(aws codepipeline start-pipeline-execution --name $PIPELINE_NAME)
echo $EXECUTION_ID

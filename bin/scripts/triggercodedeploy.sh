#!/usr/bin/env bash

######################################################################
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. #
# SPDX-License-Identifier: MIT-0                                     #
######################################################################

export AWS_ACCOUNT_ID=117134819170
export AWS_DEFAULT_REGION=ap-southeast-2

cdk bootstrap aws://117134819170/ap-southeast-2

export DEPLOYMENT_ID=$(aws deploy create-deployment --cli-input-yaml file://code-deploy.yaml --region $AWS_DEFAULT_REGION)
echo $DEPLOYMENT_ID
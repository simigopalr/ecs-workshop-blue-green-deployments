#!/usr/bin/env node

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import 'source-map-support/register';
import { App, DefaultStackSynthesizer } from 'aws-cdk-lib';
import { BlueGreenContainerImageStack } from '../lib/bluegreen-container.stack';
import { BlueGreenPipelineStack } from '../lib/bluegreen-pipeline-stack';

const app = new App();
const testenv = { account: '117134819170', region: 'ap-southeast-2' };
const codeRepoName='nginx-sample';
const apiName = 'nginx-sample';
const containerPort = 80;
const cidr = '10.0.0.0/16';


new BlueGreenContainerImageStack(app, 'BlueGreenContainerImageStack', {
    description: 'Builds the blue/green deployment container build stack',
    env: testenv,
    repo: codeRepoName,
    synthesizer: new DefaultStackSynthesizer({
        qualifier: 'poc659isf',
        fileAssetsBucketName: 'poc-custom-s3bucket', // more likely e.g. 'cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}'
        bucketPrefix: '',
        imageAssetsRepositoryName: 'poc-custom-ecrrepo'
  })
});

new BlueGreenPipelineStack(app, 'BlueGreenPipelineStack', {
    description: 'Builds the blue/green deployment pipeline stack',
    env: testenv,
    apiName,
    containerPort,
    cidr,
    synthesizer: new DefaultStackSynthesizer({
        qualifier: 'ato659isf',
        fileAssetsBucketName: 'poc-custom-s3bucket', // more likely e.g. 'cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}'
        bucketPrefix: '',
        imageAssetsRepositoryName: 'poc-custom-ecrrepo'
  })
});
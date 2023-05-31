#!/usr/bin/env node

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Construct } from 'constructs';
import 'source-map-support/register';
import { Fn, Stack, StackProps, CfnParameter } from 'aws-cdk-lib';
import * as EcsBlueGreen from '../lib';

export interface pipelineProps extends StackProps {
  apiName: string,
  containerPort: number,
  cidr: string
}

export class BlueGreenPipelineStack extends Stack {

    constructor(scope: Construct, id: string, props: pipelineProps) {
        super(scope, id, props);
        
        const ecrRepoName =  Fn.importValue('ecrRepoName');
        const codeBuildProjectName = Fn.importValue('codeBuildProjectName');
        const codeRepoName = Fn.importValue('repositoryName');
        const ecsTaskRoleArn = Fn.importValue('ecsTaskRoleArn');
        

        const deploymentConfigName = new CfnParameter(this, 'deploymentConfigName', {
            type: 'String',
            default: 'CodeDeployDefault.ECSLinear10PercentEvery1Minutes',
            allowedValues: [
                'CodeDeployDefault.ECSLinear10PercentEvery1Minutes',
                'CodeDeployDefault.ECSLinear10PercentEvery3Minutes',
                'CodeDeployDefault.ECSCanary10Percent5Minutes',
                'CodeDeployDefault.ECSCanary10Percent15Minutes',
                'CodeDeployDefault.ECSAllAtOnce'
            ],
            description: 'Shifts x percentage of traffic every x minutes until all traffic is shifted',
        });

        const taskSetTerminationTimeInMinutes = new CfnParameter(this, 'taskSetTerminationTimeInMinutes', {
            type: 'Number',
            default: '10',
            description: 'TaskSet termination time in minutes',
        });

        // Build the stack
        const ecsBlueGreenCluster = new EcsBlueGreen.EcsBlueGreenCluster(this, 'EcsBlueGreenCluster', {
            cidr: props.cidr
        });

        new EcsBlueGreen.EcsBlueGreenPipeline(this, 'EcsBlueGreenPipeline', {
            apiName: props.apiName,
            deploymentConfigName: deploymentConfigName.valueAsString,
            cluster: ecsBlueGreenCluster.cluster,
            vpc: ecsBlueGreenCluster.vpc,
            containerPort: props.containerPort,
            ecrRepoName,
            codeBuildProjectName,
            codeRepoName,
            ecsTaskRoleArn,
            taskSetTerminationTimeInMinutes: taskSetTerminationTimeInMinutes.valueAsNumber
        })
    }
}
#!/usr/bin/env node

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Construct } from 'constructs';
import 'source-map-support/register';
import { Stack, StackProps, CfnParameter } from 'aws-cdk-lib';
import * as EcsBlueGreen from '../lib';

export interface containerProps extends StackProps {
  repo: string
}

export class BlueGreenContainerImageStack extends Stack {
    
    constructor(scope: Construct, id: string, props: containerProps) {
        super(scope, id, props);

        // Defining the CFN input parameters
        const codeRepoDesc = new CfnParameter(this, 'codeRepoDesc', {
            type: 'String',
            description: 'CodeCommit repository for the ECS blue/green demo',
            default: 'Source code for the ECS blue/green demo'
        });
        
        // Build the stack
        const ecsBlueGreenRoles = new EcsBlueGreen.EcsBlueGreenRoles(this, 'EcsBlueGreenRoles');
        new EcsBlueGreen.EcsBlueGreenBuildImage(this, 'EcsBlueGreenBuildImage', {
            codeBuildRole: ecsBlueGreenRoles.codeBuildRole,
            ecsTaskRole: ecsBlueGreenRoles.ecsTaskRole,
            codeRepoName: props.repo,
            codeRepoDesc: codeRepoDesc.valueAsString
        });
    }
}
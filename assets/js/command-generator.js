/**
 * AWS EC2構築ガイド - コマンド生成ツール
 * 共通JavaScript関数
 */

// ========================================
// 汎用ユーティリティ関数
// ========================================

// /**
//  * クリップボードにテキストをコピー
//  * @param {string} text - コピーするテキスト
//  * @param {string} successElementId - 成功メッセージを表示する要素のID
//  */
// async function copyToClipboard(text, successElementId) {
//   try {
//     await navigator.clipboard.writeText(text);
//     if (successElementId) {
//       const elem = document.getElementById(successElementId);
//       if (elem) {
//         elem.textContent = '? コピーしました！';
//         elem.style.display = 'inline';
//         setTimeout(() => {
//           elem.textContent = '';
//           elem.style.display = 'none';
//         }, 2000);
//       }
//     }
//     return true;
//   } catch (err) {
//     console.error('コピー失敗:', err);
//     alert('コピーに失敗しました。手動でコピーしてください。');
//     return false;
//   }
// }

// /**
//  * 要素から値を取得
//  * @param {string} elementId - 要素のID
//  * @returns {string} 要素の値
//  */
// function getValue(elementId) {
//   const elem = document.getElementById(elementId);
//   return elem ? elem.value.trim() : '';
// }

// /**
//  * 要素にテキストを設定
//  * @param {string} elementId - 要素のID
//  * @param {string} text - 設定するテキスト
//  */
// function setText(elementId, text) {
//   const elem = document.getElementById(elementId);
//   if (elem) {
//     elem.textContent = text;
//   }
// }

// // ========================================
// // CloudFormationコマンド生成
// // ========================================

// /**
//  * CloudFormationスタック作成コマンドを生成・更新
//  */
// function updateCreateStackCommand() {
//   const stackName = getValue('cfn-stack-name') || 'ec2-test-stack';
//   const templateFile = getValue('cfn-template-file') || 'template.yaml';
//   const region = getValue('cfn-region') || 'ap-northeast-1';
  
//   const command = `aws cloudformation create-stack \\
//   --stack-name ${stackName} \\
//   --template-body file://${templateFile} \\
//   --region ${region} \\
//   --capabilities CAPABILITY_IAM`;
  
//   setText('cfn-create-command', command);
// }

// /**
//  * CloudFormationスタック作成コマンドをコピー
//  */
// async function copyCreateStackCommand() {
//   const command = document.getElementById('cfn-create-command').textContent;
//   await copyToClipboard(command, 'cfn-create-success');
// }

// /**
//  * CloudFormationスタック状態確認コマンドを生成・更新
//  */
// function updateDescribeStackCommand() {
//   const stackName = getValue('cfn-stack-name') || 'ec2-test-stack';
  
//   const command = `aws cloudformation describe-stacks \\
//   --stack-name ${stackName} \\
//   --query "Stacks[0].StackStatus"`;
  
//   setText('cfn-describe-command', command);
// }

// /**
//  * CloudFormationスタック状態確認コマンドをコピー
//  */
// async function copyDescribeStackCommand() {
//   const command = document.getElementById('cfn-describe-command').textContent;
//   await copyToClipboard(command, 'cfn-describe-success');
// }

// /**
//  * CloudFormationスタック削除コマンドを生成・更新
//  */
// function updateDeleteStackCommand() {
//   const stackName = getValue('cfn-stack-name') || 'ec2-test-stack';
//   const region = getValue('cfn-region') || 'ap-northeast-1';
  
//   const command = `aws cloudformation delete-stack \\
//   --stack-name ${stackName} \\
//   --region ${region}`;
  
//   setText('cfn-delete-command', command);
// }

// /**
//  * CloudFormationスタック削除コマンドをコピー
//  */
// async function copyDeleteStackCommand() {
//   const command = document.getElementById('cfn-delete-command').textContent;
//   await copyToClipboard(command, 'cfn-delete-success');
// }

// // ========================================
// // EC2インスタンス操作コマンド生成
// // ========================================

// /**
//  * インスタンス情報取得コマンドを生成・更新
//  */
// function updateInstanceCommands() {
//   const instanceId = getValue('ec2-instance-id') || 'i-xxxxxxxxxxxxxxxxx';
  
//   // パブリックIP取得
//   const ipCommand = `aws ec2 describe-instances \\
//   --instance-ids ${instanceId} \\
//   --query "Reservations[0].Instances[0].PublicIpAddress" \\
//   --output text`;
//   setText('ec2-ip-command', ipCommand);
  
//   // パブリックDNS取得
//   const dnsCommand = `aws ec2 describe-instances \\
//   --instance-ids ${instanceId} \\
//   --query "Reservations[0].Instances[0].PublicDnsName" \\
//   --output text`;
//   setText('ec2-dns-command', dnsCommand);
  
//   // インスタンス状態確認
//   const stateCommand = `aws ec2 describe-instances \\
//   --instance-ids ${instanceId} \\
//   --query "Reservations[0].Instances[0].State.Name"`;
//   setText('ec2-state-command', stateCommand);
// }

// /**
//  * SSH接続コマンドを生成・更新
//  */
// function updateSSHCommand() {
//   const keyFile = getValue('ssh-key-file') || 'my-ec2-test-key.pem';
//   const publicIp = getValue('ssh-public-ip') || '<パブリックIP>';
  
//   const command = `ssh -i ${keyFile} ec2-user@${publicIp}`;
//   setText('ssh-command', command);
// }

// /**
//  * SSH接続コマンドをコピー
//  */
// async function copySSHCommand() {
//   const command = document.getElementById('ssh-command').textContent;
//   await copyToClipboard(command, 'ssh-success');
// }

// // ========================================
// // セキュリティグループ操作コマンド生成
// // ========================================

// /**
//  * セキュリティグループコマンドを生成・更新
//  */
// function updateSecurityGroupCommands() {
//   const sgId = getValue('sg-id') || 'sg-xxxxxxxxxxxxxxxxx';
//   const myIp = getValue('sg-my-ip') || '0.0.0.0';
  
//   // SSH全開放ルール削除
//   const revokeSSH = `aws ec2 revoke-security-group-ingress \\
//   --group-id ${sgId} \\
//   --protocol tcp \\
//   --port 22 \\
//   --cidr 0.0.0.0/0`;
//   setText('sg-revoke-ssh', revokeSSH);
  
//   // HTTP全開放ルール削除
//   const revokeHTTP = `aws ec2 revoke-security-group-ingress \\
//   --group-id ${sgId} \\
//   --protocol tcp \\
//   --port 80 \\
//   --cidr 0.0.0.0/0`;
//   setText('sg-revoke-http', revokeHTTP);
  
//   // SSH用ルール追加
//   const authorizeSSH = `aws ec2 authorize-security-group-ingress \\
//   --group-id ${sgId} \\
//   --protocol tcp \\
//   --port 22 \\
//   --cidr ${myIp}/32`;
//   setText('sg-authorize-ssh', authorizeSSH);
  
//   // HTTP用ルール追加
//   const authorizeHTTP = `aws ec2 authorize-security-group-ingress \\
//   --group-id ${sgId} \\
//   --protocol tcp \\
//   --port 80 \\
//   --cidr ${myIp}/32`;
//   setText('sg-authorize-http', authorizeHTTP);
// }

// /**
//  * セキュリティグループコマンドをコピー
//  * @param {string} commandId - コマンドが表示されている要素のID
//  * @param {string} successId - 成功メッセージを表示する要素のID
//  */
// async function copySGCommand(commandId, successId) {
//   const command = document.getElementById(commandId).textContent;
//   await copyToClipboard(command, successId);
// }

// // ========================================
// // 初期化処理
// // ========================================

// /**
//  * ページ読み込み時の初期化
//  */
// document.addEventListener('DOMContentLoaded', function() {
//   // CloudFormationコマンド初期化
//   if (document.getElementById('cfn-stack-name')) {
//     updateCreateStackCommand();
//     updateDescribeStackCommand();
//     updateDeleteStackCommand();
//   }
  
//   // EC2コマンド初期化
//   if (document.getElementById('ec2-instance-id')) {
//     updateInstanceCommands();
//   }
  
//   // SSHコマンド初期化
//   if (document.getElementById('ssh-key-file')) {
//     updateSSHCommand();
//   }
  
//   // セキュリティグループコマンド初期化
//   if (document.getElementById('sg-id')) {
//     updateSecurityGroupCommands();
//   }
// });

// // ========================================
// // 動的パス置換機能
// // ========================================

// /**
//  * 動的パス入力フィールドを初期化
//  */
// function initDynamicPaths() {
//   // .dynamic-path クラスを持つすべての要素を処理
//   document.querySelectorAll('.dynamic-path').forEach(container => {
//     const input = container.querySelector('input[type="text"]');
//     const codeBlock = container.querySelector('pre code, pre');
    
//     if (!input || !codeBlock) return;
    
//     // 初期値を保存（テンプレート）
//     const template = codeBlock.textContent;
    
//     // コピーボタンを追加
//     if (!container.querySelector('.copy-btn')) {
//       const copyBtn = document.createElement('button');
//       copyBtn.className = 'btn btn-small btn-primary copy-btn';
//       copyBtn.textContent = '? コピー';
//       copyBtn.style.marginTop = '8px';
      
//       const successMsg = document.createElement('span');
//       successMsg.className = 'copy-success';
//       successMsg.style.marginLeft = '10px';
      
//       copyBtn.addEventListener('click', async () => {
//         await copyToClipboard(codeBlock.textContent, null);
//         successMsg.textContent = '? コピーしました！';
//         successMsg.style.display = 'inline';
//         setTimeout(() => {
//           successMsg.textContent = '';
//           successMsg.style.display = 'none';
//         }, 2000);
//       });
      
//       const btnContainer = document.createElement('div');
//       btnContainer.appendChild(copyBtn);
//       btnContainer.appendChild(successMsg);
//       container.appendChild(btnContainer);
//     }
    
//     // 入力時にコードブロックを更新
//     input.addEventListener('input', () => {
//       codeBlock.textContent = input.value;
//     });
    
//     // 初期表示を更新
//     codeBlock.textContent = input.value;
//   });
// }

// // ページ読み込み時に初期化
// document.addEventListener('DOMContentLoaded', function() {
//   // 動的パス機能を初期化
//   initDynamicPaths();
// });

// // ========================================
// // パス組み立て機能（拡張版）
// // ========================================

// /**
//  * パス組み立て機能を初期化（コマンド生成にも対応）
//  */
// function initPathBuilder() {
//   // .path-builder クラスを持つコンテナを処理
//   document.querySelectorAll('.path-builder').forEach(container => {
//     const baseInput = container.querySelector('.input-base-path');
//     const subInput = container.querySelector('.input-sub-path');
//     const regionInput = container.querySelector('.input-region');
    
//     // グループIDを取得
//     const groupId = container.dataset.group;
//     if (!groupId) return;
    
//     // 更新関数
//     function updatePaths() {
//       const basePath = baseInput ? baseInput.value.trim() : '';
//       const subPath = subInput ? subInput.value.trim() : '';
//       const region = regionInput ? regionInput.value.trim() : '';
      
//       // パスを組み合わせ
//       let fullPath = '';
//       if (basePath && subPath) {
//         fullPath = basePath.replace(/\\+$/, '') + '\\' + subPath.replace(/^\\+/, '');
//       }
      
//       // フルパス出力を更新
//       const fullPathOutput = document.querySelector(`[data-path-output="${groupId}"]`);
//       if (fullPathOutput) {
//         const codeElem = fullPathOutput.querySelector('code') || fullPathOutput;
//         codeElem.textContent = fullPath;
//       }
      
//       // cdコマンド出力を更新
//       const cdOutput = document.querySelector(`[data-cd-output="${groupId}"]`);
//       if (cdOutput) {
//         const codeElem = cdOutput.querySelector('code') || cdOutput;
//         codeElem.textContent = `cd "${fullPath}"`;
//       }
      
//       // mkdirコマンド出力を更新
//       const mkdirOutput = document.querySelector(`[data-mkdir-output="${groupId}"]`);
//       if (mkdirOutput) {
//         const codeElem = mkdirOutput.querySelector('code') || mkdirOutput;
//         codeElem.textContent = `mkdir "${fullPath}"`;
//       }
      
//       // CloudFormation create-stack コマンド
//       const cfnCreateOutput = document.querySelector(`[data-cfn-create-output]`);
//       if (cfnCreateOutput && groupId === 'cfn-create') {
//         const stackName = basePath;
//         const templateFile = subPath;
//         const codeElem = cfnCreateOutput.querySelector('code') || cfnCreateOutput;
//         codeElem.textContent = `aws cloudformation create-stack --stack-name ${stackName} --template-body file://${templateFile} --region ${region} --capabilities CAPABILITY_IAM`;
//       }
      
//       // CloudFormation describe-stacks コマンド
//       const cfnDescribeOutput = document.querySelector(`[data-cfn-describe-output]`);
//       if (cfnDescribeOutput && groupId === 'cfn-create') {
//         const stackName = basePath;
//         const codeElem = cfnDescribeOutput.querySelector('code') || cfnDescribeOutput;
//         codeElem.textContent = `aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].StackStatus"`;
//       }
      
//       // CloudFormation delete-stack コマンド
//       const cfnDeleteOutput = document.querySelector(`[data-cfn-delete-output]`);
//       if (cfnDeleteOutput && groupId === 'cfn-create') {
//         const stackName = basePath;
//         const codeElem = cfnDeleteOutput.querySelector('code') || cfnDeleteOutput;
//         codeElem.textContent = `aws cloudformation delete-stack --stack-name ${stackName} --region ${region}`;
//       }
//     }
    
//     // 入力時に更新
//     if (baseInput) baseInput.addEventListener('input', updatePaths);
//     if (subInput) subInput.addEventListener('input', updatePaths);
//     if (regionInput) regionInput.addEventListener('input', updatePaths);
    
//     // 初期表示
//     updatePaths();
//   });
// }

// // ページ読み込み時に初期化
// document.addEventListener('DOMContentLoaded', function() {
//   // パス組み立て機能を初期化
//   initPathBuilder();
// });

// ========================================
// コマンドテンプレート定義
// ========================================

const COMMAND_TEMPLATES = {
  // パス系コマンド
  'mkdir': 'mkdir "{{FULL_PATH}}"',
  'cd': 'cd "{{FULL_PATH}}"',
  'rmdir': 'rmdir /s /q "{{FULL_PATH}}"',
  
  // CloudFormation系コマンド
  'cfn-create': 'aws cloudformation create-stack --stack-name {{STACK_NAME}} --template-body file://{{TEMPLATE_FILE}} --region {{REGION}} --capabilities CAPABILITY_IAM',
  'cfn-describe': 'aws cloudformation describe-stacks --stack-name {{STACK_NAME}} --query "Stacks[0].StackStatus"',
  'cfn-delete': 'aws cloudformation delete-stack --stack-name {{STACK_NAME}} --region {{REGION}}',
};

// ========================================
// テンプレート置換関数
// ========================================

function replaceTemplate(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// ========================================
// テキスト組み立て機能（統一版）
// ========================================

function initTextBuilder() {
  document.querySelectorAll('.text-builder').forEach(container => {
    const groupId = container.dataset.group;
    if (!groupId) return;
    
    // data-var属性を持つすべての入力フィールドを取得
    const inputs = container.querySelectorAll('input[data-var]');
    if (inputs.length === 0) return;
    
    function updateTexts() {
      const values = {};
      
      // すべての入力値を収集
      inputs.forEach(input => {
        const varName = input.dataset.var;
        values[varName] = input.value.trim();
      });
      
      // BASE_PATHとSUB_PATHが存在する場合、FULL_PATHを生成
      if (values.BASE_PATH && values.SUB_PATH) {
        const basePath = values.BASE_PATH.replace(/\\+$/, '');
        const subPath = values.SUB_PATH.replace(/^\\+/, '');
        values.FULL_PATH = basePath + '\\' + subPath;
      }
      
      // グループIDに紐づくすべての出力を更新
      const outputs = document.querySelectorAll(`[data-output-group="${groupId}"]`);
      
      outputs.forEach(output => {
        const commandType = output.dataset.commandType;
        
        if (commandType && COMMAND_TEMPLATES[commandType]) {
          // テンプレートからコマンドを生成
          const template = COMMAND_TEMPLATES[commandType];
          const command = replaceTemplate(template, values);
          
          const codeElem = output.querySelector('code') || output;
          codeElem.textContent = command;
        }
      });
    }
    
    // すべての入力フィールドにイベントリスナーを追加
    inputs.forEach(input => {
      input.addEventListener('input', updateTexts);
    });
    
    // 初期表示
    updateTexts();
  });
}

// ========================================
// 初期化
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initTextBuilder();
});

// ========================================
// テンプレート置換機能
// ========================================

/**
 * テンプレート定義（拡張しやすいように外部化）
 */
const TEMPLATES = {
  'cloudformation-yaml': 
`AWSTemplateFormatVersion: '2010-09-09'
Description: 'EC2 Instance with Amazon Linux 2023'

Parameters:
  KeyName:
    Type: String
    Default: {{KEY_NAME}}
    Description: Name of an existing EC2 KeyPair

  LatestAmiId:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64
    Description: Latest Amazon Linux 2023 AMI ID from SSM Parameter Store

Resources:
  EC2Role:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ec2.amazonaws.com
            Action: 'sts:AssumeRole'
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
      Tags:
        - Key: Name
          Value: {{ROLE_NAME}}
        - Key: {{TAG_KEY}}
          Value: {{TAG_VALUE}}

  EC2InstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Roles:
        - !Ref EC2Role

  EC2SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: {{SG_NAME}}
      GroupDescription: Security group for EC2 test instance
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: {{SSH_IP}}
          Description: Allow SSH from specific IP
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: {{HTTP_IP}}
          Description: Allow HTTP from specific IP
      Tags:
        - Key: Name
          Value: {{SG_NAME}}
        - Key: {{TAG_KEY}}
          Value: {{TAG_VALUE}}

  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !Ref LatestAmiId
      InstanceType: t2.micro
      KeyName: !Ref KeyName
      SecurityGroupIds:
        - !Ref EC2SecurityGroup
      IamInstanceProfile: !Ref EC2InstanceProfile
      UserData:
        Fn::Base64: |
          #!/bin/bash
          yum update -y
          yum install -y httpd
          systemctl start httpd
          systemctl enable httpd
          echo "<h1>Hello from Amazon Linux 2023!</h1>" > /var/www/html/index.html
          echo "<p>Instance ID: $(ec2-metadata --instance-id | cut -d ' ' -f 2)</p>" >> /var/www/html/index.html
          echo "<p>Availability Zone: $(ec2-metadata --availability-zone | cut -d ' ' -f 2)</p>" >> /var/www/html/index.html
      Tags:
        - Key: Name
          Value: {{INSTANCE_NAME}}
        - Key: {{TAG_KEY}}
          Value: {{TAG_VALUE}}

Outputs:
  InstanceId:
    Description: EC2 Instance ID
    Value: !Ref EC2Instance
  
  PublicIP:
    Description: Public IP Address
    Value: !GetAtt EC2Instance.PublicIp
  
  PublicDNS:
    Description: Public DNS Name
    Value: !GetAtt EC2Instance.PublicDnsName
  
  WebsiteURL:
    Description: Website URL
    Value: !Sub 'http://\${EC2Instance.PublicDnsName}'
  
  SSHCommand:
    Description: SSH Connection Command
    Value: !Sub 'ssh -i {{KEY_NAME}}.pem ec2-user@\${EC2Instance.PublicIp}'
  
  AmiId:
    Description: AMI ID used for this instance
    Value: !Ref LatestAmiId`
};

/**
 * テンプレート置換処理
 * @param {string} template - テンプレート文字列
 * @param {Object} values - 置換する値のオブジェクト
 * @returns {string} 置換後の文字列
 */
function renderTemplate(template, values) {
  let result = template;
  
  // プレースホルダーを置換
  for (const [key, value] of Object.entries(values)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, value);
  }
  
  return result;
}

/**
 * テンプレート生成機能を初期化
 */
function initTemplateGenerator() {
  // .template-generator クラスを持つコンテナを処理
  document.querySelectorAll('.template-generator').forEach(container => {
    const templateName = container.dataset.template;
    const groupId = container.dataset.group;
    
    if (!templateName || !groupId || !TEMPLATES[templateName]) {
      console.error('Invalid template configuration:', templateName, groupId);
      return;
    }
    
    // すべての入力フィールドを取得
    const inputs = container.querySelectorAll('input[data-var]');
    
    // 更新関数
    function updateTemplate() {
      // 入力値を収集
      const values = {};
      inputs.forEach(input => {
        const varName = input.dataset.var;
        values[varName] = input.value.trim();
      });
      
      // テンプレートをレンダリング
      const rendered = renderTemplate(TEMPLATES[templateName], values);
      
      // 出力先のコードブロックを更新
      const outputs = document.querySelectorAll(`[data-template-output="${groupId}"]`);
      outputs.forEach(output => {
        const codeElem = output.querySelector('code') || output;
        codeElem.textContent = rendered;
      });
    }
    
    // 各入力フィールドにイベントリスナーを追加
    inputs.forEach(input => {
      input.addEventListener('input', updateTemplate);
    });
    
    // 初期表示
    updateTemplate();
  });
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
  // テンプレート生成機能を初期化
  initTemplateGenerator();
});
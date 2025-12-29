/**
 * AWS EC2構築ガイド - コマンド生成ツール
 * 共通JavaScript関数
 */

// ========================================
// 統一テンプレート定義（コマンドもYAMLも同じ場所）
// ========================================

const COMMAND_TEMPLATES = {
  // パス系コマンド
  'mkdir': 'mkdir "{{FULL_PATH}}"',
  'cd': 'cd "{{FULL_PATH}}"',
  
  // CloudFormation系コマンド
  'cfn-create': 'aws cloudformation create-stack --stack-name {{STACK_NAME}} --template-body file://{{TEMPLATE_FILE}} --region {{REGION}} --capabilities CAPABILITY_IAM',
  'cfn-describe': 'aws cloudformation describe-stacks --stack-name {{STACK_NAME}} --query "Stacks[0].StackStatus"',
  'cfn-delete': 'aws cloudformation delete-stack --stack-name {{STACK_NAME}} --region {{REGION}}',
  'cfn-get-instance-id': 'aws cloudformation describe-stacks --stack-name {{STACK_NAME}} --query "Stacks[0].Outputs[?OutputKey==\'InstanceId\'].OutputValue" --output text',
  
  // EC2系コマンド
  'ec2-describe-state': 'aws ec2 describe-instances --instance-ids {{INSTANCE_ID}} --query "Reservations[0].Instances[0].State.Name"',
  'ec2-describe-status': 'aws ec2 describe-instance-status --instance-ids {{INSTANCE_ID}} --query "InstanceStatuses[0].InstanceStatus.Status"',
  'ec2-get-public-ip': 'aws ec2 describe-instances --instance-ids {{INSTANCE_ID}} --query "Reservations[0].Instances[0].PublicIpAddress" --output text',
  'ec2-get-public-dns': 'aws ec2 describe-instances --instance-ids {{INSTANCE_ID}} --query "Reservations[0].Instances[0].PublicDnsName" --output text',
  
  // EC2停止系コマンド
  'ec2-stop': 'aws ec2 stop-instances --instance-ids {{INSTANCE_ID}}',

  // セキュリティグループ系コマンド
  'sg-get-id': 'aws ec2 describe-security-groups --filters "Name=group-name,Values={{SG_NAME}}" --query "SecurityGroups[0].GroupId" --output text',
  'sg-describe': 'aws ec2 describe-security-groups --group-ids {{SECURITY_GROUP_ID}}',
  
  // Web URL生成
  'web-url-dns': 'http://{{PUBLIC_DNS}}',
  'web-url-ip': 'http://{{PUBLIC_IP}}',

  // テンプレートファイル
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
    Value: !Ref LatestAmiId`,

  // 他のテンプレートを追加したい場合はここに追加
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
// 統一テキスト組み立て機能
// ========================================

function initTextBuilder() {
  // ページ全体から data-var を持つすべての入力フィールドを取得
  const allInputs = document.querySelectorAll('input[data-var]');
  
  // グローバル更新関数
  function updateAllOutputs() {
    // ページ全体から値を収集
    const globalValues = {};
    
    allInputs.forEach(input => {
      const varName = input.dataset.var;
      globalValues[varName] = input.value.trim();
    });
    
    // BASE_PATHとSUB_PATHが存在する場合、FULL_PATHを生成
    if (globalValues.BASE_PATH && globalValues.SUB_PATH) {
      const basePath = globalValues.BASE_PATH.replace(/\\+$/, '');
      const subPath = globalValues.SUB_PATH.replace(/^\\+/, '');
      globalValues.FULL_PATH = basePath + '\\' + subPath;
    }
    
    // コードブロックの出力を更新
    document.querySelectorAll('[data-output-group]').forEach(output => {
      const commandType = output.dataset.commandType;
      
      if (commandType && COMMAND_TEMPLATES[commandType]) {
        const template = COMMAND_TEMPLATES[commandType];
        const command = replaceTemplate(template, globalValues);
        
        const codeElem = output.querySelector('code') || output;
        codeElem.textContent = command;
      }
    });
    
    // テキスト要素の出力を更新（★ 修正 ★）
    document.querySelectorAll('[data-text-template]').forEach(element => {
      const template = element.dataset.textTemplate;
      if (template) {
        const text = replaceTemplate(template, globalValues);
        
        // 既存のテキストと違う場合のみ更新
        if (element.textContent !== text) {
          element.textContent = text;
        }
      }
    });
  }
  
  // すべての入力フィールドにイベントリスナーを追加
  allInputs.forEach(input => {
    input.addEventListener('input', updateAllOutputs);
  });
  
  // 初期表示
  updateAllOutputs();
}

// ========================================
// 初期化
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initTextBuilder();
});
---
layout: default
title: CloudFormation構築
parent: 構築方法
nav_order: 1
---

<!-- 共通CSS・JS読み込み -->
<link rel="stylesheet" href="../assets/css/style.css">
<script src="../assets/js/command-generator.js"></script>

# VSCodeでCloudFormationテンプレートを使った構築

ローカル環境でVSCodeを使用してCloudFormationテンプレートファイルからEC2インスタンスを構築します。

<details markdown="1" class="toc-collapse">
<summary>📑 目次</summary>
{: .no_toc }

* TOC
{:toc}

</details>

---

## 概要

- ローカル環境でVSCodeを使用（事前にインストールが必要）
- VSCodeのターミナルは主に「Command Prompt(cmd)」「PowerShell」「Git Bash」などを使用可能
- 当手順では「**cmd**」を使用
- 「**Amazon Linux 2023**」を使用し、Apache httpdによる簡易Webサーバーが自動で起動するEC2を構築

---

## 前提条件

- AWS CLIがインストール・設定済み
- VSCodeがインストール済み
- キーペアを作成済み（[キーペア作成手順](keypair.md)参照）

---

## 1. テンプレートで構築

### 1-1. VSCodeのターミナルを開く

**Ctrl + J** でターミナルを開く

### 1-2. EC2構築用フォルダに移動

#### 作業フォルダ（例）
```
C:\my-aws
```

#### EC2構築用のテンプレートを作成するフォルダ
```
C:\my-aws\aws-learning-projects\ec2-cloudformation
```

#### フォルダ移動コマンド
```batch
cd "C:\my-aws\aws-learning-projects\ec2-cloudformation"
```

> **💡 ヒント**  
> フォルダパスは各自の環境に合わせて変更してください

---

### 1-3. CloudFormationテンプレートファイルを作成

#### テンプレートファイルを開く
```batch
code ./template.yaml
```

VSCodeで新しいファイルが開きます。

#### template.yaml の内容

以下の内容をコピー＆ペーストしてください：

<details markdown="1">
<summary>template.yaml（クリックして展開）</summary>
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'EC2 Instance with Amazon Linux 2023'

Parameters:
  KeyName:
    Type: String
    Default: my-ec2-test-key
    Description: Name of an existing EC2 KeyPair

  LatestAmiId:
    Type: AWS::SSM::Parameter::Value
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
          Value: ec2-test-role
        - Key: CmBillingGroup
          Value: k18

  EC2InstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Roles:
        - !Ref EC2Role

  EC2SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: ec2-test-sg
      GroupDescription: Security group for EC2 test instance
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0
          Description: Allow SSH from anywhere (TEMPORARY - CHANGE LATER)
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
          Description: Allow HTTP from anywhere (TEMPORARY - CHANGE LATER)
      Tags:
        - Key: Name
          Value: ec2-test-sg
        - Key: CmBillingGroup
          Value: k18

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
          echo "Hello from Amazon Linux 2023!" > /var/www/html/index.html
          echo "Instance ID: $(ec2-metadata --instance-id | cut -d ' ' -f 2)" >> /var/www/html/index.html
          echo "Availability Zone: $(ec2-metadata --availability-zone | cut -d ' ' -f 2)" >> /var/www/html/index.html
      Tags:
        - Key: Name
          Value: ec2-test-instance-al2023
        - Key: CmBillingGroup
          Value: k18

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
    Value: !Sub 'http://${EC2Instance.PublicDnsName}'
  
  SSHCommand:
    Description: SSH Connection Command
    Value: !Sub 'ssh -i my-ec2-test-key.pem ec2-user@${EC2Instance.PublicIp}'
  
  AmiId:
    Description: AMI ID used for this instance
    Value: !Ref LatestAmiId
```

</details>

> **⚠️ 重要**  
> 上記テンプレートでは `CidrIp: 0.0.0.0/0` （全世界に公開）になっています。  
> これは一時的な措置で、後の手順で実際のIPアドレスに制限します。

#### 主要なパラメータ

| パラメータ | 値（例） | 説明 |
|-----------|---------|------|
| KeyName | `my-ec2-test-key` | 作成したキーペア名 |
| EC2Role | `ec2-test-role` | EC2用IAMロール |
| SecurityGroup | `ec2-test-sg` | セキュリティグループ名 |
| InstanceName | `ec2-test-instance-al2023` | EC2インスタンス名 |
| CmBillingGroup | `k18` | 請求グループタグ（任意） |

---

### 1-4. CloudFormationでスタック作成

<div class="command-generator">
  <h4>📋 スタック作成コマンド生成</h4>
  
  <div class="form-group">
    <label>スタック名:</label>
    <input type="text" id="cfn-stack-name" value="ec2-test-stack" oninput="updateCreateStackCommand(); updateDescribeStackCommand(); updateDeleteStackCommand();">
  </div>
  
  <div class="form-group">
    <label>テンプレートファイル名:</label>
    <input type="text" id="cfn-template-file" value="template.yaml" oninput="updateCreateStackCommand();">
  </div>
  
  <div class="form-group">
    <label>リージョン:</label>
    <input type="text" id="cfn-region" value="ap-northeast-1" oninput="updateCreateStackCommand(); updateDeleteStackCommand();">
  </div>
  
  <div class="command-output">
    <h5>生成されたコマンド:</h5>
    <pre id="cfn-create-command"></pre>
    <button class="btn btn-primary" onclick="copyCreateStackCommand()">📋 コマンドをコピー</button>
    <span id="cfn-create-success" class="copy-success"></span>
  </div>
</div>

#### スタック作成コマンド
```batch
aws cloudformation create-stack --stack-name ec2-test-stack --template-body file://template.yaml --region ap-northeast-1 --capabilities CAPABILITY_IAM
```

**パラメータ説明**:
- `--stack-name`: スタック名
- `--template-body`: テンプレートファイルのパス
- `--region`: リージョン（東京: `ap-northeast-1`）
- `--capabilities CAPABILITY_IAM`: IAMリソース作成の許可

#### 成功時の出力例
```json
{
    "StackId": "arn:aws:cloudformation:ap-northeast-1:123456789012:stack/ec2-test-stack/..."
}
```

---

### 1-5. スタック作成状態の確認

<div class="command-generator">
  <h4>📊 スタック状態確認コマンド</h4>
  
  <div class="command-output">
    <p>上記で入力したスタック名を使用します。</p>
    <pre id="cfn-describe-command"></pre>
    <button class="btn btn-primary" onclick="copyDescribeStackCommand()">📋 コマンドをコピー</button>
    <span id="cfn-describe-success" class="copy-success"></span>
  </div>
</div>

#### スタック状態確認
```batch
aws cloudformation describe-stacks --stack-name ec2-test-stack --query "Stacks[0].StackStatus"
```

**出力例**:
- `"CREATE_IN_PROGRESS"` - 作成中
- `"CREATE_COMPLETE"` - 作成完了
- `"CREATE_FAILED"` - 作成失敗

#### EC2インスタンスIDの取得
```batch
aws cloudformation describe-stacks --stack-name ec2-test-stack --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue" --output text
```

**出力例**:
```
i-0eb82246240955484
```

このインスタンスIDを控えておいてください（後の手順で使用）。

---

### 1-6. 作成されたインスタンスの状態確認

#### インスタンスの状態確認
```batch
aws ec2 describe-instances --instance-ids i-0eb82246240955484 --query "Reservations[0].Instances[0].State.Name"
```

**出力例**:
- `"pending"` - 起動中
- `"running"` - 実行中

#### インスタンスのステータスチェック
```batch
aws ec2 describe-instance-status --instance-ids i-0eb82246240955484 --query "InstanceStatuses[0].InstanceStatus.Status"
```

**出力例**:
- `"initializing"` - 初期化中
- `"ok"` - 正常

---

### 1-7. セキュリティグループの確認

#### セキュリティグループIDの確認
```batch
aws ec2 describe-security-groups --filters "Name=group-name,Values=ec2-test-sg" --query "SecurityGroups[0].GroupId" --output text
```

**出力例**:
```
sg-0a1b2c3d4e5f6g7h8
```

#### セキュリティグループのルール確認
```batch
aws ec2 describe-security-groups --group-ids sg-0a1b2c3d4e5f6g7h8
```

現在の設定（SSH: 0.0.0.0/0、HTTP: 0.0.0.0/0）が確認できます。

---

### 1-8. 接続情報の取得

#### パブリックIPv4アドレス取得
```batch
aws ec2 describe-instances --instance-ids i-0eb82246240955484 --query "Reservations[0].Instances[0].PublicIpAddress" --output text
```

**出力例**:
```
13.158.139.175
```

#### パブリックDNS取得
```batch
aws ec2 describe-instances --instance-ids i-0eb82246240955484 --query "Reservations[0].Instances[0].PublicDnsName" --output text
```

**出力例**:
```
ec2-13-158-139-175.ap-northeast-1.compute.amazonaws.com
```

---

### 1-9. Webアクセス確認

ブラウザで以下のURLにアクセス:
```
http://ec2-13-158-139-175.ap-northeast-1.compute.amazonaws.com
```

または
```
http://13.158.139.175
```

**表示内容**:
```
Hello from Amazon Linux 2023!
Instance ID: i-0eb82246240955484
Availability Zone: ap-northeast-1a
```

これが表示されればWebサーバーが正常に起動しています！

---

## 2. 接続設定を個別IPに変更

セキュリティグループ接続設定を個別IPに変更してIP制限をかけます。

> **💡 注意**  
> 「1.テンプレートで構築」であらかじめ接続可能な自分用IPで構築できている場合は不要です。

---

### 2-1. EC2インスタンスの起動確認

#### インスタンス状態確認
```batch
aws ec2 describe-instances --instance-ids i-0eb82246240955484 --query "Reservations[0].Instances[0].State.Name"
```

ステータスが `"running"` であることを確認。

起動されていない場合は以下のコマンドで起動:
```batch
aws ec2 start-instances --instance-ids i-0eb82246240955484
```

---

### 2-2. EC2インスタンスへSSH接続
```batch
ssh -i my-ec2-test-key.pem ec2-user@13.158.139.175
```

> **💡 ヒント**  
> 権限エラーになる場合は[キーペア作成手順](keypair.md)を参照して.pemファイルの権限を変更してください。

---

### 2-3. 自分のIPアドレスを確認

#### 方法A: SSH接続元IPを確認（最も確実）

SSH接続後、EC2インスタンス内で以下を実行:
```bash
echo $SSH_CLIENT
```

**出力例**:
```
133.201.31.192 54321 22
```

最初の数字（`133.201.31.192`）があなたの実際のSSH接続元IPアドレスです。

#### 方法B: Apacheアクセスログを確認

ブラウザでWebアクセスした後、以下を実行:
```bash
sudo cat /var/log/httpd/access_log | tail -5
```

**出力例**:
```
133.201.31.192 - - [21/Dec/2025:10:23:45 +0000] "GET / HTTP/1.1" 200 156
```

最初の数字があなたのHTTP接続元IPアドレスです。

#### IPアドレスをメモ

確認したIPアドレス（例: `133.201.31.192`）を控えておいてください。

SSH接続を終了:
```bash
exit
```

---

### 2-4. セキュリティグループを更新

<div class="command-generator">
  <h4>🔒 セキュリティグループ更新コマンド生成</h4>
  
  <div class="form-group">
    <label>セキュリティグループID:</label>
    <input type="text" id="sg-id" value="sg-xxxxxxxxxxxxxxxxx" oninput="updateSecurityGroupCommands();">
    <small>EC2コンソールまたはAWS CLIで確認</small>
  </div>
  
  <div class="form-group">
    <label>あなたのIPアドレス:</label>
    <input type="text" id="sg-my-ip" value="133.201.31.192" oninput="updateSecurityGroupCommands();" placeholder="例: 133.201.31.192">
    <small>※ echo $SSH_CLIENT で確認したIP</small>
  </div>
  
  <div class="command-output">
    <h5>1. SSH全開放ルール削除:</h5>
    <pre id="sg-revoke-ssh"></pre>
    <button class="btn btn-danger btn-small" onclick="copySGCommand('sg-revoke-ssh', 'sg-revoke-ssh-success')">📋 コピー</button>
    <span id="sg-revoke-ssh-success" class="copy-success"></span>
  </div>
  
  <div class="command-output">
    <h5>2. HTTP全開放ルール削除:</h5>
    <pre id="sg-revoke-http"></pre>
    <button class="btn btn-danger btn-small" onclick="copySGCommand('sg-revoke-http', 'sg-revoke-http-success')">📋 コピー</button>
    <span id="sg-revoke-http-success" class="copy-success"></span>
  </div>
  
  <div class="command-output">
    <h5>3. SSH用ルール追加（自分のIP）:</h5>
    <pre id="sg-authorize-ssh"></pre>
    <button class="btn btn-success btn-small" onclick="copySGCommand('sg-authorize-ssh', 'sg-authorize-ssh-success')">📋 コピー</button>
    <span id="sg-authorize-ssh-success" class="copy-success"></span>
  </div>
  
  <div class="command-output">
    <h5>4. HTTP用ルール追加（自分のIP）:</h5>
    <pre id="sg-authorize-http"></pre>
    <button class="btn btn-success btn-small" onclick="copySGCommand('sg-authorize-http', 'sg-authorize-http-success')">📋 コピー</button>
    <span id="sg-authorize-http-success" class="copy-success"></span>
  </div>
</div>

#### 現在の全開放ルール（0.0.0.0/0）を削除

##### SSH用ルール削除
```batch
aws ec2 revoke-security-group-ingress --group-id sg-0a1b2c3d4e5f6g7h8 --protocol tcp --port 22 --cidr 0.0.0.0/0
```

##### HTTP用ルール削除
```batch
aws ec2 revoke-security-group-ingress --group-id sg-0a1b2c3d4e5f6g7h8 --protocol tcp --port 80 --cidr 0.0.0.0/0
```

---

#### 自分のIPアドレスでルールを追加

##### SSH用ルール追加（ポート22）
```batch
aws ec2 authorize-security-group-ingress --group-id sg-0a1b2c3d4e5f6g7h8 --protocol tcp --port 22 --cidr 133.201.31.192/32
```

> **💡 重要**  
> `133.201.31.192` は手順2-3で確認したIPアドレスに置き換えてください。  
> `/32` は単一IPアドレスを意味します。

##### HTTP用ルール追加（ポート80）
```batch
aws ec2 authorize-security-group-ingress --group-id sg-0a1b2c3d4e5f6g7h8 --protocol tcp --port 80 --cidr 133.201.31.192/32
```

---

### 2-5. 接続確認

#### SSH接続テスト
```batch
ssh -i my-ec2-test-key.pem ec2-user@13.158.139.175
```

接続できることを確認。

#### HTTP接続テスト

ブラウザで `http://13.158.139.175` にアクセスして表示されることを確認。

---

## 3. インスタンス停止＆スタック削除

使用しなくなったら、課金を防ぐため必ず削除してください。

---

### 3-1. EC2インスタンスを停止（オプション）

スタック削除前にインスタンスを停止することも可能です（必須ではありません）。

#### インスタンス停止コマンド
```batch
aws ec2 stop-instances --instance-ids i-0eb82246240955484
```

#### 停止確認
```batch
aws ec2 describe-instances --instance-ids i-0eb82246240955484 --query "Reservations[0].Instances[0].State.Name"
```

ステータスが `"stopped"` になれば停止完了。

---

### 3-2. CloudFormationスタックを削除

<div class="command-generator">
  <h4>🗑️ スタック削除コマンド</h4>
  
  <div class="command-output">
    <p>上記で入力したスタック名とリージョンを使用します。</p>
    <pre id="cfn-delete-command"></pre>
    <button class="btn btn-danger" onclick="copyDeleteStackCommand()">📋 コマンドをコピー</button>
    <span id="cfn-delete-success" class="copy-success"></span>
  </div>
</div>

> **💡 注意**  
> EC2インスタンスが起動中（running）の状態であっても、CloudFormationスタックの削除は実行可能です。  
> EC2インスタンスを停止しておく必要はありません。

#### スタック削除コマンド
```batch
aws cloudformation delete-stack --stack-name ec2-test-stack --region ap-northeast-1
```

#### 削除確認
```batch
aws cloudformation describe-stacks --stack-name ec2-test-stack --query "Stacks[0].StackStatus"
```

**出力の変化**:
- `"DELETE_IN_PROGRESS"` - 削除中
- `"DELETE_COMPLETE"` - 削除完了（この後エラーになる）

削除完了後はスタックが存在しないためエラーになります:
```
An error occurred (ValidationError) when calling the DescribeStacks operation: Stack with id ec2-test-stack does not exist
```

このエラーが出れば完全に削除されています。

---

## まとめ

この手順では以下を学びました：

1. **CloudFormationテンプレートの作成** - YAML形式でインフラを定義
2. **AWS CLIでのスタック作成** - コマンドラインからのデプロイ
3. **セキュリティグループの設定** - IP制限によるアクセス制御
4. **リソースの削除** - 不要なリソースのクリーンアップ

### 次のステップ

- [コマンド生成ツール](../tools/command-generator.html)を使って効率的にコマンドを作成
- 他のAWSサービス（RDS、S3など）との連携を試す
- CloudFormationテンプレートをカスタマイズ

[← トップページに戻る](../index.md) | [← 前へ: キーペア作成](keypair.md)
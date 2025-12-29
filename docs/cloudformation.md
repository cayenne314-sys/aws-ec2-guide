---
layout: default
title: CloudFormation構築
parent: 構築方法
nav_order: 1
---

<!-- 共通CSS・JS読み込み -->
<!-- <link rel="stylesheet" href="../assets/css/style.css"> -->
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

作業フォルダとプロジェクトフォルダを入力してください。

<div class="text-builder" data-group="ec2-text">
  <div class="form-group">
    <label>作業フォルダ:</label>
    <input type="text" data-var="BASE_PATH" value="C:\my-aws">
    <small>ベースとなる作業フォルダのパス</small>
  </div>
  
  <div class="form-group">
    <label>EC2構築用フォルダ:</label>
    <input type="text" data-var="SUB_PATH" value="aws-learning-projects\ec2-cloudformation">
    <small>プロジェクト用のサブフォルダ</small>
  </div>
</div>

#### フォルダ作成コマンド
```batch
mkdir "C:\my-aws\aws-learning-projects\ec2-cloudformation"
```
{: data-output-group="ec2-text" data-command-type="mkdir"}

#### フォルダ移動コマンド
```batch
cd "C:\my-aws\aws-learning-projects\ec2-cloudformation"
```
{: data-output-group="ec2-text" data-command-type="cd"}

> **💡 ヒント**  
> フォルダパスは各自の環境に合わせて上記の入力欄で変更してください。コマンドが自動的に更新されます。

---

### 1-3. CloudFormationテンプレートファイルを作成

以下のパラメータを入力してください。自動的にテンプレートとコマンドが生成されます。

<div class="text-builder" data-group="cfn-template">
  <div class="template-form">
    <div class="form-group">
      <label>テンプレートファイル名:</label>
      <input type="text" data-var="TEMPLATE_FILE" value="template.yaml">
      <small>作成するテンプレートファイル名</small>
    </div>
    
    <div class="form-group">
      <label>リージョン:</label>
      <input type="text" data-var="REGION" value="ap-northeast-1">
      <small>東京リージョン: ap-northeast-1</small>
    </div>
    
    <div class="form-group">
      <label>キーペア名:</label>
      <input type="text" data-var="KEY_NAME" value="my-ec2-test-key">
      <small>作成済みのキーペア名</small>
    </div>
    
    <div class="form-group">
      <label>IAMロール名:</label>
      <input type="text" data-var="ROLE_NAME" value="ec2-k18-01-role">
      <small>EC2用のIAMロール</small>
    </div>
    
    <div class="form-group">
      <label>セキュリティグループ名:</label>
      <input type="text" data-var="SG_NAME" value="ec2-k18-01-sg">
      <small>セキュリティグループの名前</small>
    </div>
    
    <div class="form-group">
      <label>SSH接続元IP:</label>
      <input type="text" data-var="SSH_IP" value="133.201.31.192/32">
      <small>ポート22の許可IP</small>
    </div>
    
    <div class="form-group">
      <label>HTTP接続元IP:</label>
      <input type="text" data-var="HTTP_IP" value="133.201.31.192/32">
      <small>ポート80の許可IP</small>
    </div>
    
    <div class="form-group">
      <label>インスタンス名:</label>
      <input type="text" data-var="INSTANCE_NAME" value="ec2-k18-01-instance-al2023">
      <small>EC2インスタンスの名前</small>
    </div>
    
    <div class="form-group">
      <label>請求グループタグキー:</label>
      <input type="text" data-var="TAG_KEY" value="CmBillingGroup">
      <small>コスト管理用タグのキー</small>
    </div>
    
    <div class="form-group">
      <label>請求グループタグ値:</label>
      <input type="text" data-var="TAG_VALUE" value="k18">
      <small>コスト管理用タグの値</small>
    </div>
  </div>
</div>

#### 生成されたテンプレート

<details markdown="1" open>
<!-- <summary>📄 <span data-text-template="{{TEMPLATE_FILE}}">template.yaml</span></summary> -->
<!-- <summary>📄 <span data-text-template="&#123;&#123;TEMPLATE_FILE&#125;&#125;">template.yaml</span></summary> -->
<summary>📄 <span data-text-template="{% raw %}{{TEMPLATE_FILE}}{% endraw %}">template.yaml</span></summary>
<!-- <summary>📄 <span data-text-output="template-filename">template.yaml</span></summary> -->
```yaml
AWSTemplateFormatVersion: '2010-09-09'
...
```
{: data-output-group="cfn-template" data-command-type="cloudformation-yaml"}

</details>

> **💡 ヒント**  
> 上記のパラメータを変更すると、テンプレートが自動的に更新されます。右上のコピーアイコンでコピーしてください。

> **⚠️ 重要**  
> SSH_IP と HTTP_IP は自分の実際のIPアドレスに変更してください。初期値の `133.201.31.192/32` はサンプルです。

---

### 1-4. CloudFormationでスタック作成

スタック名を入力してください。テンプレートファイル名とリージョンは1-3で設定した値が使用されます。

<div class="text-builder" data-group="cfn-create">
  <div class="form-group">
    <label>スタック名:</label>
    <input type="text" data-var="STACK_NAME" value="ec2-test-stack">
    <small>CloudFormationスタックの名前</small>
  </div>
</div>

#### スタック作成コマンド
```batch
aws cloudformation create-stack --stack-name ec2-test-stack --template-body file://template.yaml --region ap-northeast-1 --capabilities CAPABILITY_IAM
```
{: data-output-group="cfn-create" data-command-type="cfn-create"}
{: .wrap-code}

<!-- #### スタック削除コマンド
```batch
aws cloudformation delete-stack --stack-name ec2-test-stack --region ap-northeast-1
```
{: data-output-group="cfn-create" data-command-type="cfn-delete"} -->

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

- `"CREATE_COMPLETE"` - 作成完了
- `"CREATE_FAILED"` - 作成失敗

---

#### EC2インスタンスIDの取得
```batch
aws cloudformation describe-stacks --stack-name ec2-test-stack --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue" --output text
```
{: data-output-group="cfn-status" data-command-type="cfn-get-instance-id"}
{: .wrap-code}

**出力例**:
```
i-xxxxxxxxxxxxxxxxx
```

取得したインスタンスIDを以下に入力してください（後の手順で使用）。

<div class="text-builder" data-group="ec2-instance">
  <div class="form-group">
    <label>EC2インスタンスID:</label>
    <input type="text" data-var="INSTANCE_ID" value="i-xxxxxxxxxxxxxxxxx" placeholder="i-xxxxxxxxxxxxxxxxx">
    <small>CloudFormationで作成されたインスタンスID</small>
  </div>
</div>

---

### 1-6. 作成されたインスタンスの状態確認

#### インスタンスの状態確認
```batch
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxxxxxxx --query "Reservations[0].Instances[0].State.Name"
```
{: data-output-group="ec2-instance" data-command-type="ec2-describe-state"}
{: .wrap-code}

**出力例**:
- `"pending"` - 起動中
- `"running"` - 実行中

---

#### インスタンスのステータスチェック
```batch
aws ec2 describe-instance-status --instance-ids i-xxxxxxxxxxxxxxxxx --query "InstanceStatuses[0].InstanceStatus.Status"
```
{: data-output-group="ec2-instance" data-command-type="ec2-describe-status"}
{: .wrap-code}

**出力例**:
- `"initializing"` - 初期化中
- `"ok"` - 正常

> **💡 ヒント**  
> ステータスが `"ok"` になるまで数分かかる場合があります。上記のコマンドを定期的に実行して確認してください。
```

---

### 1-7. セキュリティグループの確認

#### セキュリティグループIDの確認
```batch
aws ec2 describe-security-groups --filters "Name=group-name,Values=ec2-k18-01-sg" --query "SecurityGroups[0].GroupId" --output text
```
{: data-output-group="sg-info" data-command-type="sg-get-id"}
{: .wrap-code}

**出力例**:
```
sg-xxxxxxxxxxxxxxxxx
```

取得したセキュリティグループIDを以下に入力してください。

<div class="text-builder" data-group="sg-info">
  <div class="form-group">
    <label>セキュリティグループID:</label>
    <input type="text" data-var="SECURITY_GROUP_ID" value="sg-xxxxxxxxxxxxxxxxx" placeholder="sg-xxxxxxxxxxxxxxxxx">
    <small>CloudFormationで作成されたセキュリティグループID</small>
  </div>
</div>

---

#### セキュリティグループのルール確認
```batch
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxxxxxxxxxx
```
{: data-output-group="sg-info" data-command-type="sg-describe"}

現在の設定（SSH: 0.0.0.0/0、HTTP: 0.0.0.0/0）が確認できます。

---

### 1-8. 接続情報の取得

#### パブリックIPv4アドレス取得
```batch
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxxxxxxx --query "Reservations[0].Instances[0].PublicIpAddress" --output text
```
{: data-output-group="connection-info" data-command-type="ec2-get-public-ip"}
{: .wrap-code}

**出力例**:
```
x.x.x.x
```

#### パブリックDNS取得
```batch
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxxxxxxx --query "Reservations[0].Instances[0].PublicDnsName" --output text
```
{: data-output-group="connection-info" data-command-type="ec2-get-public-dns"}
{: .wrap-code}

**出力例**:
```
ec2-x-x-x-x.ap-northeast-1.compute.amazonaws.com
```

取得した接続情報を以下に入力してください。

<div class="text-builder" data-group="connection-info">
  <div class="form-group">
    <label>パブリックIPv4アドレス:</label>
    <input type="text" data-var="PUBLIC_IP" value="x.x.x.x" placeholder="x.x.x.x">
    <small>EC2インスタンスのパブリックIPアドレス</small>
  </div>
  
  <div class="form-group">
    <label>パブリックDNS:</label>
    <input type="text" data-var="PUBLIC_DNS" value="ec2-x-x-x-x.ap-northeast-1.compute.amazonaws.com" placeholder="ec2-x-x-x-x.ap-northeast-1.compute.amazonaws.com">
    <small>EC2インスタンスのパブリックDNS名</small>
  </div>
</div>

---

### 1-9. Webアクセス確認

ブラウザで以下のURLにアクセスしてください。

#### URL（IP）
```
http://13.158.139.175
```
{: data-output-group="web-url" data-command-type="web-url-ip"}

#### URL（DNS）
```
http://ec2-13-158-139-175.ap-northeast-1.compute.amazonaws.com
```
{: data-output-group="web-url" data-command-type="web-url-dns"}

**表示内容**:
```
Hello from Amazon Linux 2023!
Instance ID: i-xxxxxxxxxxxxxxxxx
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
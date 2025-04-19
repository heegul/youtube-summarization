# Deployment Guide

This document outlines the deployment process for the YouTube Summarization app, with a focus on iOS deployment, CI/CD pipeline setup, and App Store submission.

## Prerequisites

Before starting the deployment process, ensure you have the following:

- **Apple Developer Account** ($99/year) with app-specific certificates
- **Xcode** (latest version) installed on macOS
- **Fastlane** installed for automated deployment
- **GitHub Actions** access for CI/CD pipeline
- **App Store Connect** access configured
- **Code signing certificates** and provisioning profiles

## CI/CD Pipeline Setup

### GitHub Actions Configuration

Create `.github/workflows/ios-deploy.yml`:

```yaml
name: iOS Deployment

on:
  push:
    branches: [ main ]
    paths:
      - 'ios/**'
      - '.github/workflows/ios-deploy.yml'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '2.7'
          
      - name: Install dependencies
        run: |
          gem install bundler
          bundle install
          
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install JS dependencies
        run: |
          yarn install
          
      - name: Set up code signing
        uses: apple-actions/import-codesign-certs@v1
        with:
          p12-file-base64: ${{ secrets.IOS_CERTIFICATES_P12 }}
          p12-password: ${{ secrets.IOS_CERTIFICATES_P12_PASSWORD }}
          keychain-password: ${{ secrets.KEYCHAIN_PASSWORD }}
          
      - name: Run Fastlane
        run: |
          cd ios
          bundle exec fastlane beta
        env:
          APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}
          APP_STORE_CONNECT_API_KEY_ISSUER_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY_CONTENT: ${{ secrets.APP_STORE_CONNECT_API_KEY_CONTENT }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
```

## Fastlane Configuration

Create `ios/fastlane/Fastfile`:

```ruby
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    setup_ci if ENV['CI']
    
    # App Store Connect API Authentication
    app_store_connect_api_key(
      key_id: ENV["APP_STORE_CONNECT_API_KEY_ID"],
      issuer_id: ENV["APP_STORE_CONNECT_API_KEY_ISSUER_ID"],
      key_content: ENV["APP_STORE_CONNECT_API_KEY_CONTENT"],
      in_house: false
    )
    
    # Code signing
    match(
      type: "appstore",
      readonly: true
    )
    
    # Update version if needed
    increment_build_number(
      build_number: latest_testflight_build_number + 1
    )
    
    # Build the app
    build_app(
      scheme: "YouTubeSummarizerApp",
      workspace: "YouTubeSummarizerApp.xcworkspace",
      export_method: "app-store"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end
end
```

## Certificate Management with Fastlane Match

Set up `match` for managing certificates and provisioning profiles:

```bash
# Initialize match (run once)
cd ios
fastlane match init

# Generate certificates and profiles
fastlane match appstore
```

Configure `ios/fastlane/Matchfile`:

```ruby
git_url("https://github.com/your-org/ios-certificates.git")
storage_mode("git")
type("appstore")
app_identifier(["com.yourdomain.youtubeSummarizer"])
username("your@apple.developer.email")
```

## iOS App Deployment Steps

### Development Builds

1. **Prepare the build**:
   ```bash
   cd ios
   fastlane beta
   ```

2. **Monitor build progress** in App Store Connect or TestFlight

### TestFlight Distribution

1. Configure test groups in App Store Connect
2. Add testers by email or public link
3. Set up testing information (what to test, contact info)

### App Store Submission

1. Prepare App Store listing:
   - App description
   - Screenshots (6.5" iPhone, 12.9" iPad, etc.)
   - App icon (1024x1024px)
   - Keywords and categories
   - Privacy policy URL

2. Submit for review:
   ```bash
   cd ios
   fastlane deliver
   ```

3. Respond to reviewer questions promptly

## Post-Launch Monitoring

- Set up **App Store Connect Analytics** to track downloads and retention
- Configure **crash reporting** with Firebase Crashlytics
- Monitor **user reviews** and ratings
- Prepare for **rapid response** to critical issues

## CI/CD Secrets Management

Store the following secrets in GitHub repository settings:

- `IOS_CERTIFICATES_P12`: Base64-encoded P12 certificate
- `IOS_CERTIFICATES_P12_PASSWORD`: Password for P12 file
- `KEYCHAIN_PASSWORD`: Password for temporary keychain
- `APP_STORE_CONNECT_API_KEY_ID`: App Store Connect API Key ID
- `APP_STORE_CONNECT_API_KEY_ISSUER_ID`: Issuer ID
- `APP_STORE_CONNECT_API_KEY_CONTENT`: Private key content
- `MATCH_PASSWORD`: Password for match certificate repository

## Additional Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
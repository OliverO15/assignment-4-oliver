import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
    applicationId: '7a3be2c0-f8e9-4315-b782-490d73d58f37',
    clientToken: 'pub31687333337d3be2d4df3f501fbf78cd',
    site: 'us5.datadoghq.com',
    service: 'todos',
    env: 'prod',

    // Specify a version number to identify the deployed version of your application in Datadog
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask-user-input',
    plugins: [reactPlugin({ router: false })],
});
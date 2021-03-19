/*!
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */


import fetch from 'cross-fetch';
import { userAgentHeaders } from './userAgent';

const introspect = async function introspect({ domain, interactionHandle, stateHandle, version }) {

  const target = `${domain}/idp/idx/introspect`;
  const body = stateHandle ? { stateToken: stateHandle } : { interactionHandle };
  return fetch(target, {
    method: 'POST',
    headers: {
      ...userAgentHeaders(),
      'content-type': `application/ion+json; okta-version=${version}`, // Server wants this version info
      accept: `application/ion+json; okta-version=${version}`,
    },
    body: JSON.stringify(body)
  })
    .then( response => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then( err => {
        if (err.version) { // assumed idx response
          return err; // http errors with idx responses are not rejected
        }
        return Promise.reject(err);
      });
    });
};

export default introspect;

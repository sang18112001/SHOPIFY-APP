import { LegacyCard, Form, FormLayout, TextField } from '@shopify/polaris';
import React from 'react';
import TextEditor from './TextEditor';

const FormNewPage = () => {
  return (
    <Form>
      <FormLayout>
        <LegacyCard sectioned>
          <TextField label="Title" />
          <div>
            <TextEditor />
          </div>
        </LegacyCard>
      </FormLayout>
    </Form>
  );
};

export default FormNewPage;

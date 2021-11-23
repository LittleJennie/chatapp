import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const NewMessage = ({socket, user}) => {
  const [value, setValue] = useState('');

  return (
    <Formik
      initialValues={{ val: '' }}
      onSubmit={({ val }) => {
        socket.emit('message', { val, userId: user.id, room: user.room });
        setValue('');
      }}
    >
    <Form>
      <Field name="val" type="text" />
      <ErrorMessage name="val" />

      <button type="submit">Send Message</button>
    </Form>
  </Formik>
  );
};

export default NewMessage;

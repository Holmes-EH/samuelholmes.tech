import { createForm } from "@tanstack/solid-form";
import * as v from "valibot";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";

const formSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

type formSchemaType = v.InferInput<typeof formSchema>;

const LoginForm = () => {
  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
    } as formSchemaType,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  }));
  return (
    <Card class="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          You must Login to access the Dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          class="flex w-full flex-col gap-7"
        >
          <form.Field name="email">
            {(field) => (
              <TextField
                validationState={
                  field().state.meta.isTouched && !field().state.meta.isValid
                    ? "invalid"
                    : "valid"
                }
                name={field().name}
                value={field().state.value}
                onBlur={field().handleBlur}
                onChange={field().handleChange}
              >
                <TextFieldLabel>Email</TextFieldLabel>
                <TextFieldInput placeholder="my@email.com" />
                <TextFieldErrorMessage errors={field().state.meta.errors} />
              </TextField>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <TextField
                validationState={
                  field().state.meta.isTouched && !field().state.meta.isValid
                    ? "invalid"
                    : "valid"
                }
                name={field().name}
                value={field().state.value}
                onBlur={field().handleBlur}
                onChange={field().handleChange}
                datatype="password"
              >
                <TextFieldLabel>Password</TextFieldLabel>
                <TextFieldInput placeholder="*****" type="password" />
                <TextFieldErrorMessage errors={field().state.meta.errors} />
              </TextField>
            )}
          </form.Field>
        </form>
      </CardContent>
      <CardFooter>
        <div class="flex gap-2">
          <Button type="submit" form="login-form">
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

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
import { createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/solid-query";
import { useGraphQLClient } from "@/lib/graphql";
import { LoginResponse, MutationRootLoginUserArgs } from "@/generated/graphql";
import { useErrorHandler } from "@/lib/errors";
import { useToast } from "@/contexts/ToastContext";
import { LOGIN_USER } from "@/lib/gql";

const formSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

type formSchemaType = v.InferInput<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const client = useGraphQLClient();
  const toast = useToast();
  const handleError = useErrorHandler();

  const loginMutation = useMutation(() => ({
    mutationFn: async (input: MutationRootLoginUserArgs) => {
      const data = await client.request<{ loginUser: LoginResponse }>(
        LOGIN_USER,
        {
          email: input.email,
          password: input.password,
        },
      );
      return data.loginUser;
    },
  }));

  createEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  });

  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
    } as formSchemaType,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value: { email, password } }) => {
      try {
        const loginUser = await loginMutation.mutateAsync({ email, password });
        toast.success(`Hello ${loginUser.user.name}`);
        login(loginUser.token, loginUser.user);
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        handleError(error, "Failed to Login User");
      }
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

export default Login;

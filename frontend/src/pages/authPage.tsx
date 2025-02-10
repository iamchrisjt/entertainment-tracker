import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useState } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const loginSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required" }).min(8)
});

type LoginFormFields = z.infer<typeof loginSchema>;

const signupSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required"}).min(8),
    confirmPassword: z.string()
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
	path: ["confirmPassword"]
});

type SignupFormFields = z.infer<typeof signupSchema>;

const AuthPage = () => {
	const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        setError: setLoginError,
        formState: { errors: loginErrors, isSubmitting: loginIsSubmitting }
    } = useForm<LoginFormFields>({
        resolver: zodResolver(loginSchema)
    });
	const {
        register: signUpRegister,
        handleSubmit: handleSignupSubmit,
		setError: setSignUpErrors,
        formState: { errors: signUpErrors, isSubmitting: signUpIsSubmitting }
    } = useForm<SignupFormFields>({
        resolver: zodResolver(signupSchema)
    });
	const [showPassword, setShowPassword] = useState(false);
	const { signUp, login, isSigningUp, isLoggingIn } = useAuthStore();

    const onLoginSubmit: SubmitHandler<LoginFormFields> = async (data) => {
        try {
            await login(data);
        } catch (error: any) {
            setLoginError("root", {
                message: error.toString()
            });
        }
    }

    const onSignupSubmit: SubmitHandler<SignupFormFields> = async (data) => {
        try {
            await signUp(data);
        } catch (error : any) {
            setSignUpErrors("root", {
				message: error.toString()
			});
        }
    }

	return (
		<div className="flex items-center justify-center min-h-screen bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Authentication</CardTitle>
					<CardDescription>Login or create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="login" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="login">Login</TabsTrigger>
							<TabsTrigger value="signup">Sign Up</TabsTrigger>
						</TabsList>

						{/* Login Tab */}
						<TabsContent value="login">
							<form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4 pt-4">
								<div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        {...loginRegister("email")}
										type="text"
										placeholder="Enter your email"
                                        className={loginErrors.email ? "border-red-500" : ""}
									/>
                                    {loginErrors.email && <p className="text-red-500 text-sm">{loginErrors.email.message}</p>}
                                </div>

								<div className="space-y-2">
									<Label>Password</Label>
									<Input
                                        {...loginRegister("password")}
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
                                        className={loginErrors.password ? "border-red-500" : ""}
									/>
                                    {loginErrors.password && <p className="text-red-500 text-sm">{loginErrors.password.message}</p>}
								</div>

								<div className="space-y-2">
									<Checkbox checked={showPassword} onCheckedChange={() => setShowPassword(!showPassword)} />
									<Label className="text-sm font-medium pl-1 h-4"> Show Password</Label>
								</div>

								<Button disabled={loginIsSubmitting} type="submit" className="w-full">
									{isLoggingIn ? <Loader className="size-10 animate-spin"/> : ""} {loginIsSubmitting ? "Logging in..." : "Login"}
                                </Button>

                                {loginErrors.root && <p className="text-red-500 text-sm">{loginErrors.root.message}</p>}
							</form>
						</TabsContent>

						{/* Signup Tab */}
						<TabsContent value="signup">
							<form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label>Name</Label>
									<Input
                                        {...signUpRegister("name")}
										type="text"
										placeholder="Choose a name"
									/>
                                    {signUpErrors.name && <p className="text-red-500 text-sm">{signUpErrors.name.message}</p>}
								</div>

								<div className="space-y-2">
									<Label>Email</Label>
									<Input
                                        {...signUpRegister("email")}
										type="email"
										placeholder="Enter your email"
									/>
                                    {signUpErrors.email && <p className="text-red-500 text-sm">{signUpErrors.email.message}</p>}
								</div>

								<div className="space-y-2">
									<Label>Password</Label>
									<Input
                                        {...signUpRegister("password")}
										type={showPassword ? "text" : "password"}
										placeholder="Create a password"
									/>
                                    {signUpErrors.password && <p className="text-red-500 text-sm">{signUpErrors.password.message}</p>}
								</div>

								<div className="space-y-2">
									<Label>Confirm Password</Label>
									<Input
                                        {...signUpRegister("confirmPassword")}
										type={showPassword ? "text" : "password"}
										placeholder="Confirm your password"
									/>
                                    {signUpErrors.confirmPassword && <p className="text-red-500 text-sm">{signUpErrors.confirmPassword.message}</p>}
								</div>

								<div className="space-y-2">
									<Checkbox checked={showPassword} onCheckedChange={() => setShowPassword(!showPassword)} />
									<Label className="text-sm font-medium pl-1 h-4"> Show Password</Label>
								</div>

								<Button disabled={signUpIsSubmitting} type="submit" className="w-full">
                                    {isSigningUp ? <Loader className="size-10 animate-spin"/> : ""} {signUpIsSubmitting ? "Signing Up..." : "Sign Up"}
                                </Button>
                                {signUpErrors.root && <p className="text-red-500 text-sm">{signUpErrors.root.message}</p>}
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthPage;

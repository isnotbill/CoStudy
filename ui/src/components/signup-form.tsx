import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import ReCaptcha from 'react-google-recaptcha'
import axios from "axios"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    recaptchaToken: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    console.log("Submitting form data:", formData)

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          captchaToken: formData.recaptchaToken,
        },
        { timeout: 5000 }
      )
      window.location.href='/login'
    } catch (err: any) {
      console.error("Registration failed:", err.response?.data)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="me@example.com"
                required
                onChange={(e) => handleChange(e)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" type="text" placeholder="John Doe" required onChange={(e) => handleChange(e)}/>
            </Field>
          
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required onChange={(e) => handleChange(e)}/>
              {/* <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input id="confirmPassword" type="password" required onChange={(e) => handleChange(e)}/>
              {/* <FieldDescription>Please confirm your password.</FieldDescription> */}
            </Field>
            <ReCaptcha
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token : string | null) => {
                if (token) {
                  setFormData(prev => ({
                    ...prev,
                    ['recaptchaToken']: token
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    ['recaptchaToken']: ''
                  }));
                }
              }}
              className="flex justify-center items-center w-full">
            </ReCaptcha>
            <FieldGroup>
              <Field>
                <Button type="submit" onClick={(e) => handleSubmit(e)}>Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

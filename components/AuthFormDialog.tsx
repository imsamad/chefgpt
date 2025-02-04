import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function AuthFormDialog() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen((p) => !p)}>Login</Button>
      </DialogTrigger>
      <DialogContent
        handleClose={() => {
          setOpen((p) => !p);
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="sm:max-w-[425px] p-0"
      >
        <VisuallyHidden>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>Sign in or sign up to continue.</DialogDescription> {/* Add this line */}
       
        </VisuallyHidden>
        <AuthForm
          isSignup={isSignUp}
          toggleForm={() => setIsSignUp((p) => !p)}
          onSubmitCB={() => {
            if (isSignUp) {
              setIsSignUp(false);
            } else {
              setOpen(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

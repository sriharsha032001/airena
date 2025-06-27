import React, { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginClient />
      </Suspense>
    </div>
  );
}

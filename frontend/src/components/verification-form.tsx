"use client";

import { FormWrapper } from "@components/form-wrapper";
import { FormTitle } from "@components/form-title";
import { type ChangeEvent, type MouseEvent, useRef, useState } from "react";
import { ActionButton } from "@components/action-button";

export const VerificationForm = () => {
  const [OTP, setOTP] = useState<(string | undefined)[]>(
    new Array(6).fill(undefined),
  );
  console.log("🚀 ~ VerificationForm ~ OTP:", OTP);

  const inputRefs = useRef<(HTMLInputElement | undefined)[]>([]);
  console.log("🚀 ~ VerificationForm ~ inputRefs:", inputRefs);

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.currentTarget.value;
    console.log("🚀 ~ handleChange ~ value:", value);

    setOTP((prevOTP) => {
      const newOTP = [...prevOTP];
      newOTP[index] = value;
      return newOTP;
    });

    // Move focus to the next input if a digit is entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (isNaN(Number(value))) return;
  };

  const handleClick = (index: number, event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.setSelectionRange(1, 1);
  };

  return (
    <FormWrapper>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <FormTitle title="Verify your email" />
        <p className="text-center text-sm text-pretty">
          Enter a 6-digit OTP sent to your email address.
        </p>

        <form onSubmit={() => {}}>
          <div className="mt-4 flex justify-center gap-3">
            {new Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                ref={(element) => {
                  if (element) inputRefs.current[index] = element;
                }}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
                autoComplete="one-time-code"
                value={OTP.at(index) ?? ""}
                onClick={(event) => handleClick(index, event)}
                onChange={(event) => handleChange(index, event)}
                className="size-10 rounded-md border-3 border-green-300/50 p-2 text-center select-none focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none sm:size-12 sm:text-xl md:size-13 md:rounded-xl md:text-2xl"
              />
            ))}
          </div>

          <ActionButton text="Verify OTP" />
        </form>
      </div>
    </FormWrapper>
  );
};

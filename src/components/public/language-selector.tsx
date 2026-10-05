"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = {
  en: { code: "EN", label: "English" },
  pt: { code: "PT", label: "Português" },
};

type Language = keyof typeof languages;

function LanguageFlag({ language }: { language: Language }) {
  return (
    <svg viewBox="0 0 60 40" className="h-3.5 w-5 shrink-0 rounded-[2px]" aria-hidden="true">
      {language === "en" ? (
        <>
          <path fill="#012169" d="M0 0h60v40H0z" />
          <path stroke="#fff" strokeWidth="8" d="m0 0 60 40M60 0 0 40" />
          <path stroke="#c8102e" strokeWidth="3" d="m0 0 60 40M60 0 0 40" />
          <path stroke="#fff" strokeWidth="12" d="M30 0v40M0 20h60" />
          <path stroke="#c8102e" strokeWidth="7" d="M30 0v40M0 20h60" />
        </>
      ) : (
        <>
          <path fill="#009739" d="M0 0h60v40H0z" />
          <path fill="#ffdf00" d="m30 4 25 16-25 16L5 20z" />
          <circle cx="30" cy="20" r="10" fill="#002776" />
          <path stroke="#fff" strokeWidth="2" d="M21 16q10 0 18 8" />
        </>
      )}
    </svg>
  );
}

export function LanguageSelector() {
  const [language, setLanguage] = useState<Language>("en");

  function selectLanguage(value: string) {
    if (value !== "en" && value !== "pt") {
      throw new Error(`Unsupported language: ${value}`);
    }
    setLanguage(value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-ui-label text-primary font-semibold px-2.5 py-1.5 rounded hover:bg-mist-gray border border-smoke/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={`Language selector: ${languages[language].label}`}
        >
          <LanguageFlag language={language} />
          <span>{languages[language].code}</span>
          <ChevronDown className="size-4 shrink-0 text-pewter" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup value={language} onValueChange={selectLanguage}>
          <DropdownMenuRadioItem value="en">
            <LanguageFlag language="en" />
            {languages.en.label}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pt">
            <LanguageFlag language="pt" />
            {languages.pt.label}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

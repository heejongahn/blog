import React, { useEffect } from "react";
import PageHelmet from "../../components/PageHelmet";

const docsUrl =
  "https://docs.google.com/document/d/1PhHZT5IF8kY3UeQzEIjawfairGsr2vtirkai8E8Hfak/edit";

export default function ResumePage() {
  useEffect(() => {
    window.location.href = docsUrl;
  }, []);

  return (
    <PageHelmet
      title="Heejong Ahn Resume"
      description="Impact Driven Software Engineer"
      url="https://ahnheejong.name/resume/"
    />
  );
}

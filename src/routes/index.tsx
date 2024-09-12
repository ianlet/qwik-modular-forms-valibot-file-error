import { component$, NoSerialize } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { formAction$, useForm, valiForm$ } from "@modular-forms/qwik";
import * as v from "valibot";
import { FileInput } from "~/components/file-input";

const isFile = (value: any): value is File => value instanceof File;
const isFileArray = (value: any): value is File[] =>
  Array.isArray(value) && value.every(isFile);

const UploadFilesSchema = v.object({
  files: v.optional(v.custom<NoSerialize<File>[]>(isFileArray)),
});

type UploadFilesFields = v.InferInput<typeof UploadFilesSchema>;

export const useUploadFiles = formAction$<UploadFilesFields>((values) => {
  console.log("UPLOADING FILES", values.files);
}, valiForm$(UploadFilesSchema));

export default component$(() => {
  const [, { Form, Field }] = useForm<UploadFilesFields>({
    loader: { value: { files: [] } },
    action: useUploadFiles(),
    validate: valiForm$(UploadFilesSchema),
  });

  return (
    <Form encType="multipart/form-data">
      <Field name="files" type="File[]">
        {(field, props) => (
          <FileInput
            {...props}
            value={field.value}
            error={field.error}
            label="File list"
            multiple
          />
        )}
      </Field>

      <button type="submit">Upload</button>
    </Form>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

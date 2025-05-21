import { useState } from 'react';
import {
  FileInput,
  Textarea,
  Button,
  Card,
  Group,
  Title,
  Text,
  Stack,
  Divider,
  ScrollArea,
  rem,
} from '@mantine/core';
import axios from 'axios';

export default function CodeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [codeText, setCodeText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileRead = async (uploadedFile: File | null) => {
    if (!uploadedFile) return;
    const text = await uploadedFile.text();
    setCodeText(text);
  };

  const handleSubmit = async () => {
    if (!codeText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/review', {
        code: codeText,
      });
      setResponse(res.data.message);
    } catch (error: any) {
      setResponse('❌ Error submitting code. Check console.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" radius="md" padding="xl" withBorder maw={rem(720)} mx="auto" mt="xl">
      <Stack gap="lg">
        <Title order={2} ta="center">
          AI Code Reviewer
        </Title>

        <Text ta="center" color="dimmed">
          Upload a C# file or paste your code below. Our AI will analyze it and provide insights.
        </Text>

        <Divider />

        <FileInput
          label="Upload a .cs file"
          placeholder="Choose file"
          value={file}
          onChange={(f) => {
            setFile(f);
            handleFileRead(f);
          }}
          accept=".cs"
        />

        <Textarea
          label="Paste your C# code"
          placeholder="// your C# code here"
          autosize
          minRows={8}
          maxRows={20}
          value={codeText}
          onChange={(e) => setCodeText(e.currentTarget.value)}
        />

        <Group justify="flex-end">
          <Button onClick={handleSubmit} loading={loading}>
            Submit for Review
          </Button>
        </Group>

        {response && (
          <>
            <Divider />
            <Text size="sm" fw={500}>Server Response</Text>
            <ScrollArea h={200}>
              <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                {response}
              </Text>
            </ScrollArea>
          </>
        )}
      </Stack>
    </Card>
  );
}

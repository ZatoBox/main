import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Img,
} from '@react-email/components';

interface Props {
  code: string;
  siteUrl: string;
}

export default function VerificationEmail({ code, siteUrl }: Props) {
  return (
    <Html>
      <Body style={{ backgroundColor: '#f7f7f7', margin: 0, padding: 0 }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 20,
            maxWidth: 600,
          }}
        >
          <Section style={{ textAlign: 'center', padding: '12px 0' }}>
            <Img
              src={`${siteUrl}/logo.png`}
              alt="Logo"
              width={140}
              height={48}
            />
          </Section>
          <Section style={{ textAlign: 'center', padding: '12px 0' }}>
            <Heading style={{ fontSize: 20, margin: '8px 0' }}>
              Verifica tu correo
            </Heading>
            <Text style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
              Usa este código para verificar tu cuenta:
            </Text>
            <Heading style={{ fontSize: 28, letterSpacing: 4 }}>{code}</Heading>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 12 }}>
              Si no pediste esto, ignora este correo.
            </Text>
          </Section>
          <Section
            style={{
              textAlign: 'center',
              padding: '12px 0',
              color: '#999',
              fontSize: 12,
            }}
          >
            <Text>Este código expira en 15 minutos.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

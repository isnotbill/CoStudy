package org.costudy.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Service
public class EmailService {

    private final SesClient sesClient;

    @Value("${cloud.aws.ses.from-email}")
    private String fromEmail;

    public EmailService(SesClient sesClient) {
        this.sesClient = sesClient;
    }

    public void sendVerificationEmail(String to, String token) {
        String verificationLink = "https://costudy.online/verify?token=" + token;

        String subject = "Email Verification";

        String htmlBody = "<h1>Email Verification</h1>" +
                "<p>Click the link below to verify your email:</p>" +
                "<a href=\"" + verificationLink + "\">Verify Email</a>";

        String textBody = "Email Verification\n" +
                "Click the link below to verify your email:\n" +
                verificationLink;

        SendEmailRequest emailRequest = SendEmailRequest.builder()
                .destination(Destination.builder()
                        .toAddresses(to)
                        .build())
                .message(Message.builder()
                        .subject(Content.builder()
                                .data(subject)
                                .charset("UTF-8")
                                .build())
                        .body(Body.builder()
                                .text(Content.builder()
                                        .data(textBody)
                                        .charset("UTF-8")
                                        .build())
                                .html(Content.builder()
                                        .data(htmlBody)
                                        .charset("UTF-8")
                                        .build())
                                .build())
                        .build())
                .source(fromEmail)
                .build();

        sesClient.sendEmail(emailRequest);

    }

}

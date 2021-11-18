package com.petify_v2;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;


public class Client {
    BufferedReader input;
    PrintWriter output;

    public Client() {
        System.out.println("starting client");
        try (Socket socket = new Socket("10.0.2.2", 5000)){
            System.out.println("Connected to server");
            input = new BufferedReader( new InputStreamReader(socket.getInputStream()));
            output = new PrintWriter(socket.getOutputStream(),true);


            ClientRunnable clientRun = new ClientRunnable(socket);

            new Thread(clientRun).start();
            while (true) {}

        } catch (Exception e) {
            System.out.println("Exception occured in client main: " + e.getMessage());
        }
    }

    public void SendMessage(String json) {
        output.println(json);
    }
}

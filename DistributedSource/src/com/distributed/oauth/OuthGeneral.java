package com.distributed.oauth;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class OuthGeneral {
	Logger logger=Logger.getLogger(OuthGoogleLogin.class.getName());
//Getting Code.	
	public String code(HttpServletRequest req, HttpServletResponse resp){
		String code=req.getParameter("code");
		return code;
	}

	//Connecting To Server and Getting The encoded Json File.
	
	public String outh(String url_addr,String method,String data ,HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException{
		HttpURLConnection connection=null;
		URL url=null;
		try{
			url = new URL(url_addr);
			connection = (HttpURLConnection) url.openConnection();
			connection.setDoOutput(true);
			connection.setRequestMethod(method);
			connection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
			//Data 
			if(data!=null)
			{
				OutputStream o = connection.getOutputStream();
				o.write(data.getBytes());
				o.close();
				logger.info("Data Sent");
			}
			//Checking Response code.
			if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
				logger.info("got response");
				InputStream is=connection.getInputStream();
				InputStreamReader in=new InputStreamReader(is);			
				BufferedReader br=new BufferedReader(in);
				StringBuilder sb=new StringBuilder();
				String line=null;
				
				while((line=br.readLine())!=null){
					sb=sb.append(line);
				}
				
				in.close();
				line=sb.toString();
				return line;
			} 
			else {
				logger.warning("bad response");
				return"error";
			}	
		}
		catch(Exception e){
			logger.warning("exception occured");
			return "error";
		}
	}
}

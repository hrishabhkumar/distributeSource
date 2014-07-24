/**
 * 
 */
package com.distributed.oauth;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * @author Hrishabh.Kumar
 *
 */
public class OuthGoogleDrive {
	//Object to access Credentials.
		GooggleCredentials credencials=new GooggleCredentials();
		
		//object to access OuthGeneral Class.
		OuthGeneral outhGeneral=new OuthGeneral();
				

		public String authenticateUser(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException, ParseException{
			
		String data = "code="+outhGeneral.code(req, resp)+"&client_id="+credencials.getCLIENT_ID()+"&client_secret="+credencials.getCLIENT_SECRET()+"&redirect_uri="+credencials.getREDIRECT_URI()+"&grant_type="+credencials.getGRANT_TYPE();
		if(data!="error"){
			String line=outhGeneral.outh(credencials.getTOKEN_URL(), "POST", data, req, resp);
			if(line!="error"){
				JSONParser parser = new JSONParser();	
				JSONObject json = (JSONObject) parser.parse(line);
				data="?access_token="+json.get("access_token");
				System.out.println("Access Token ===> "+json.get("access_token"));
				req.getSession().setAttribute("access_token", json.get("access_token"));
				line=outhGeneral.outh(credencials.getDRIVE_URL()+data, "GET", null, req, resp);
				if(line!="error"){
					json=(JSONObject) parser.parse(line);
					req.getSession().setAttribute("access_token", json);
				}
				else{
					return "error";
				}
				
				return line;
			}
			else{
				return "failed";
			}
		}
		else{
			return "failed";
		}
	}
}

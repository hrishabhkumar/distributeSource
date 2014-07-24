package com.distributed;


import java.io.IOException;
import java.util.List;
import java.util.Properties;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.distributed.jdo.PMF;
import com.distributed.jdo.PersonJDO;
import com.distributed.oauth.GooggleCredentials;
import com.distributed.oauth.GoogleDriveCredential;
import com.distributed.oauth.OuthGeneral;
import com.distributed.oauth.OuthGoogleDrive;
import com.distributed.oauth.OuthGoogleLogin;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Text;


@Controller
public class PersonController {
	JSONParser jsonParser=new JSONParser();
	
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/person", method=RequestMethod.POST)
	public @ResponseBody String savePerson(@RequestBody String personData){
		PersistenceManager pm = PMF.getPMF().getPersistenceManager();
		JSONObject personJSOn;
		System.out.println(personData);
		try {
			personJSOn = (JSONObject) jsonParser.parse(personData);
			PersonJDO personJDO=new PersonJDO();
			personJDO.setName(personJSOn.get("name").toString());
			personJDO.setJobTitle(personJSOn.get("jobTitle").toString());
			personJDO.setCompany(personJSOn.get("company").toString());
			personJDO.setSource(personJSOn.get("source").toString());
			personJDO.setPhone(personJSOn.get("phone").toString());
			personJDO.setEmail(personJSOn.get("email").toString());
			personJDO.setSocial(personJSOn.get("social").toString());
			personJDO.setWebsite(personJSOn.get("website").toString());
			personJDO.setStreet(personJSOn.get("street").toString());
			personJDO.setCity(personJSOn.get("city").toString());
			personJDO.setState(personJSOn.get("state").toString());
			personJDO.setCountry(personJSOn.get("country").toString());
			personJDO.setZip(personJSOn.get("zip").toString());
			Text txt = new Text(personJSOn.get("docsList").toString());
			personJDO.setDocList(txt);
			String keyString=KeyFactory.createKeyString(PersonJDO.class.getSimpleName(), personJSOn.get("email").toString());
			personJDO.setKey(keyString);
			pm.makePersistent(personJDO);
			personJSOn=new JSONObject();
			personJSOn.put("status", "success");
			personJSOn.put("id", keyString);
			return personJSOn.toJSONString();
		} 
		catch (ParseException e) {
			personJSOn=new JSONObject();
			personJSOn.put("status", "failed");
			return personJSOn.toJSONString();
		}
		finally{
			
			pm.close();
		}
	}
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/person", method=RequestMethod.GET)
	public @ResponseBody String getPersonData(HttpServletRequest req, HttpServletResponse resp){
		PersistenceManager pm = PMF.getPMF().getPersistenceManager();
		try
		{
			Query query=pm.newQuery(PersonJDO.class);
			List<PersonJDO> result=(List<PersonJDO>) query.execute();
			JSONArray personArray=new JSONArray();
			JSONObject personJSOn = null;
			if(!result.isEmpty())
			{
				for(PersonJDO personJDO: result)
				{
					personJSOn=new JSONObject();
					personJSOn.put("id", personJDO.getKey());
					personJSOn.put("name", personJDO.getName());
					personJSOn.put("jobTitle", personJDO.getJobTitle());
					personJSOn.put("company", personJDO.getCompany());
					personJSOn.put("phone", personJDO.getPhone());
					personJSOn.put("source", personJDO.getSource());
					personJSOn.put("email", personJDO.getEmail());
					personJSOn.put("social", personJDO.getSocial());
					personJSOn.put("website", personJDO.getWebsite());
					personJSOn.put("street", personJDO.getStreet());
					personJSOn.put("city", personJDO.getCity());
					personJSOn.put("state", personJDO.getState());
					personJSOn.put("country", personJDO.getCountry());
					personJSOn.put("zip", personJDO.getZip());
					String docsList=personJDO.getDocList().getValue();
					personJSOn.put("docsList", jsonParser.parse(docsList));
					personArray.add(personJSOn);
				}
				return personArray.toJSONString();
			}
			else
			{
				resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
				personJSOn=new JSONObject();
				personJSOn.put("status", "failed");
				return personJSOn.toJSONString();
			}
		} catch (ParseException e) 
		{
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			JSONObject personJSOn = new JSONObject();
			personJSOn.put("status", "failed");
			return personJSOn.toJSONString();
		}
		finally
		{
			
			pm.close();
		}
	}
	@RequestMapping(value="/person/{id}", method=RequestMethod.PUT)
	public @ResponseBody String updatePerson(HttpServletResponse resp,@PathVariable("id") String id,@RequestBody String personData){
		System.out.println(personData);
		JSONObject personJSOn;
		PersistenceManager pm = PMF.getPMF().getPersistenceManager();
		try {
			PersonJDO personJDO= pm.getObjectById(PersonJDO.class, id);
			personJSOn = (JSONObject) jsonParser.parse(personData);
			personJDO.setName(personJSOn.get("name").toString());
			personJDO.setJobTitle(personJSOn.get("jobTitle").toString());
			personJDO.setCompany(personJSOn.get("company").toString());
			personJDO.setSource(personJSOn.get("source").toString());
			personJDO.setPhone(personJSOn.get("phone").toString());
			personJDO.setEmail(personJSOn.get("email").toString());
			personJDO.setSocial(personJSOn.get("social").toString());
			personJDO.setWebsite(personJSOn.get("website").toString());
			personJDO.setStreet(personJSOn.get("street").toString());
			personJDO.setCity(personJSOn.get("city").toString());
			personJDO.setState(personJSOn.get("state").toString());
			personJDO.setCountry(personJSOn.get("country").toString());
			personJDO.setZip(personJSOn.get("zip").toString());
			Text txt = new Text(personJSOn.get("docsList").toString());
			personJDO.setDocList(txt);
			pm.makePersistent(personJDO);
			personJSOn=new JSONObject();
			personJSOn.put("status", "success");
			return personJSOn.toJSONString();
			
			
		} 
		catch (ParseException e) {
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			personJSOn=new JSONObject();
			personJSOn.put("status", "failed");
			return personJSOn.toJSONString();
		}
		finally{
			
			pm.close();
		}
	}
	@RequestMapping(value="/person/{id}", method=RequestMethod.DELETE)
	public @ResponseBody String deletePerson(HttpServletResponse resp,@PathVariable("id") String id,@RequestBody String personData){
		JSONObject personJSOn=new JSONObject();
		PersistenceManager pm = PMF.getPMF().getPersistenceManager();
		try {
			PersonJDO personJDO= pm.getObjectById(PersonJDO.class, id);
			pm.deletePersistent(personJDO);
			personJSOn=new JSONObject();
			personJSOn.put("status", "success");
			return personJSOn.toJSONString();
		}
		catch(Exception e){
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			personJSOn=new JSONObject();
			personJSOn.put("status", "failed");
			return personJSOn.toJSONString();
		}
		finally{
			
			pm.close();
		}
		
	}
	
	@RequestMapping(value="/sendEmail")
	public @ResponseBody String sendEmail(HttpServletRequest req, @RequestBody String msg){
		try
		{
			JSONObject msgObject=(JSONObject) jsonParser.parse(msg);
			String email = req.getSession().getAttribute("email").toString();
		    String oauthToken = req.getSession().getAttribute("access_token").toString();
		    System.out.println(msg);
		    
		    return null;
		    
		}
		catch(Exception e){
			return "error";
		}
	}
	@RequestMapping(value="/oauth2callback")
	public void login(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		
		OuthGoogleLogin outhGoogle=new OuthGoogleLogin();
		try {
			if(outhGoogle.authenticateUser(req, resp).equals("success")){
				resp.sendRedirect("/");
			}
			else{
				resp.sendRedirect("/");
			}
		} catch (IOException e) {
			
			resp.sendRedirect("/");
		} catch (ServletException e) {
			
			resp.sendRedirect("/");
		} catch (ParseException e) {
			
			resp.sendRedirect("/");
		}
		
	}
	@RequestMapping(value="/oauth2call")
	public void accessDrive(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		
		OuthGoogleDrive outhGoogleDrive=new OuthGoogleDrive();
		try {
			String driveData=outhGoogleDrive.authenticateUser(req, resp);
			if(!driveData.equals("error")){
//				JSONObject driveDataObject=(JSONObject) jsonParser.parse(driveData);
//				JSONArray driveItems=(JSONArray) driveDataObject.get("items");
//				return driveItems.toJSONString();
				resp.sendRedirect("/#/contacts");
			}
			else{
				resp.sendRedirect("/#/contacts");
			}
		} catch (IOException e) {
			
			resp.sendRedirect("/#/contacts");
		} catch (ServletException e) {
			
			resp.sendRedirect("/#/contacts");
		} catch (ParseException e) {
			
			resp.sendRedirect("/#/contacts");
		}
		
	}
	@RequestMapping(value="loggedInData")
	public @ResponseBody String getLoginData(HttpServletRequest req){
		JSONObject responsData=new JSONObject();
		responsData.put("email", req.getSession().getAttribute("email"));
		return responsData.toJSONString();
	}
	
	
	@RequestMapping (value="getDriveData")
	public @ResponseBody String getDriveData(HttpServletRequest req, HttpServletResponse resp){
		OuthGeneral outhGeneral=new  OuthGeneral();
		GooggleCredentials googgleCredentials=new GooggleCredentials();
		try {
			String driveData=outhGeneral.outh(googgleCredentials.getDRIVE_URL()+"?access_token="+req.getSession().getAttribute("access_token").toString(), "GET", null, req, resp);
			JSONObject driveDataObject=(JSONObject) jsonParser.parse(driveData);
			JSONArray driveItems=(JSONArray) driveDataObject.get("items");
			return driveItems.toJSONString();
			
			
		} catch (IOException e) {
			resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			e.printStackTrace();
			return null;
		} catch (ServletException e) {
			resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			e.printStackTrace();
			return null;
			
		} catch (ParseException e) {
			resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			e.printStackTrace();
			try{
				GoogleDriveCredential googleDriveCredential=new GoogleDriveCredential();
				String driveData=outhGeneral.outh(googleDriveCredential.getDRIVE_URL()+"?access_token="+req.getSession().getAttribute("access_token").toString(), "GET", null, req, resp);
				JSONObject driveDataObject=(JSONObject) jsonParser.parse(driveData);
				JSONArray driveItems=(JSONArray) driveDataObject.get("items");
				return driveItems.toJSONString();
			}
			catch(Exception e1){
				e1.printStackTrace();
				return null;
			}				
		}
	}
	
	@RequestMapping(value="_ah/mail/{mailAddress}")
	public void mailingService(HttpServletRequest req, HttpServletResponse resp){
		Properties props = new Properties(); 
        Session session = Session.getDefaultInstance(props, null); 
        try {
			MimeMessage message = new MimeMessage(session, req.getInputStream());
			System.out.println("From address: ===>"+message.getFrom()[0]);
			System.out.println("To address ==>"+message.getReplyTo()[0]);
			
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}

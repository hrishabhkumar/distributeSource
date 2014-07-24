package com.distributed.oauth;

public class GooggleCredentials {
	private final String CLIENT_ID="267273999336.apps.googleusercontent.com";
	private final String CLIENT_SECRET="TOfj0W1COybdC3A8xYUqVsct";
	private final String REDIRECT_URI="http://distributed-source.appspot.com/oauth2callback";
	private final String GRANT_TYPE="authorization_code";
	private final String USER_INFO_URL="https://www.googleapis.com/oauth2/v2/userinfo";
	private final String TOKEN_URL="https://accounts.google.com/o/oauth2/token";
	private final String DRIVE_URL="https://www.googleapis.com/drive/v2/files";
	
	
	public String getCLIENT_ID() {
		return CLIENT_ID;
	}

	public String getCLIENT_SECRET() {
		return CLIENT_SECRET;
	}

	public String getREDIRECT_URI() {
		return REDIRECT_URI;
	}

	public String getGRANT_TYPE() {
		return GRANT_TYPE;
	}

	public String getUSER_INFO_URL() {
		return USER_INFO_URL;
	}

	public String getTOKEN_URL() {
		return TOKEN_URL;
	}

	/**
	 * @return the dRIVE_URL
	 */
	public String getDRIVE_URL() {
		return DRIVE_URL;
	}

}

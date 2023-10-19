# get-remote-model-data

This function can be used in combination with a swagger file to retrieve data from other Betty Blocks applications using remote models.

For more information on remote models check out our documentation: https://docs.bettyblocks.com/en/articles/5798316-using-data-sources-in-your-application

## Configure this function

### PARAMS
![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/27eef09f-24e0-45ab-a533-7db6b611d027)

This is a variable that is available to all remote models and should not be replaced by anything but params!

### APPLICATION DATA API URL

![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/b85a40c5-d365-4f71-81f2-bf2a7bf9bb7d)

This is the Data API URL of your target Betty Blocks application.

### AUTHENTICATION PROFILE UUID

![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/4a94687b-85c2-4367-914e-bc240ec13e78)

This is the id of the authentication profile on your target Betty Blocks application, which will be used to authenticate the user.

### EMAIL

![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/34fae075-1e44-4d0c-9683-acae377e31fb)

Email address of the web user on your target Betty Blocks application which will be used for authentication.

### PASSWORD

![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/db82d9d7-6c65-4f50-bf7e-e7e8b1f02844)

Password of the web user on your target Betty Blocks application which will be used for authentication.

### MODEL NAME

![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/8040561c-4dd0-46e4-8782-6ae60c65785a)

The model name in your target Betty Blocks application, for which you want to display the data in your current Betty Blocks application.

### RETRIEVE TYPE

![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/66f13fd4-1c6d-4650-9744-a0e59836f76d)

Here you can specify to retrieve a single record or a collection of records. The single record option is used for the one queries, where the collection option is used for the all queries.

### RESPONSE

![image](https://github.com/Betty-Services/get-remote-model-data/assets/96063344/89bdebe5-13cc-4641-8a14-f8c28b0b6fe8)

This should be used in the Finish step of your action to return the remote data to the Page Builder.

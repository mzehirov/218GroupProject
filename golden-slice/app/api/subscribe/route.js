import mailchimp from '@mailchimp/mailchimp_marketing';
const privateKey = process.env.MAILCHIMP_API_KEY
mailchimp.setConfig({
  apiKey: privateKey,
  server: 'us21',
});
console.log('MAILCHIMP_APIKEY', process.env.MAILCHIMP_APIKEY);

export async function POST(request) {
    const {email} = await request.json();
    console.log('Email', email);
    if (!email) new Response(JSON.stringify({error: "Email is required"}));

    try {

      try {
        const memberStatus = await mailchimp.lists.getListMember('7b34cddaa3', email);
        if (memberStatus.status === 'subscribed') {
            return new Response(JSON.stringify({message: "You are already subscribed."}));
        }
    } catch (error) {
        // If error is because email is not found, continue to subscribe
        // Otherwise, return an error response
        if (error.status !== 404) {
            return new Response(JSON.stringify({error: "An error occurred."}));
        }
    }

      const res = await mailchimp.lists.addListMember('7b34cddaa3', {
        email_address: email, status: "subscribed"
      })
      return new Response(JSON.stringify({message: "Subscription successful"}));
    } catch (error) {
      return new Response(JSON.stringify({error: JSON.parse(error.response.text)}));
    }
}
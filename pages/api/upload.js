/*export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    data.append("file", file);
    data.append("pinataMetadata", JSON.stringify({ name: "File to upload" }));
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    });
    const { IpfsHash } = await res.json();
    console.log(IpfsHash);
    return new Response(JSON.stringify({ IpfsHash }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}*/
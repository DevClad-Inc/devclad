# 🚀 Serverless Userpics

**Fetch avatars for your next service in a single API call.**

## Features

- [x] 🚀 Generate avatars on the fly
- [X] 🎨 100 avatars included from [Craftwork.design](https://craftwork.design/) (I'm not affiliated with them, just a fan)
- [X] 🎨 Abstraction over [Boring Avatars](https://boringavatars.com/) included as well.
- [x] ✨ Tiny as fuck.
- [x] ✨ Serverless. Configurable. Easily deployable.

## Usage (Important)

### Routes

1. `api/getpic/`
2. `api/avatar/` - `?stream=True` query outputs an SVG for you.

#### Available Query Params

- `?name=string` - Your username. Defaults to `Cactus Jack`.
- `?size=int` - Size of the avatar. Default is 128.
- `?variant=string` - Variant of the avatar. Default is `beam`.
- `?stream=bool` - Stream the SVG instead of returning a URL. Default is False.

#### Available Variants

- `marble`
- `pixel`
- `beam`
- `sunset`
- `ring`
- `bauhaus`

All these variants and avatars (under `api/avatar/` route) are from [Boring Avatars](https://boringavatars.com/).

![Route 2](https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/dff96186-fdb4-4d1c-094a-4b63eaa7f100/public)

### Quick and dirty example

1. Head over to [userpics.devclad.com](https://userpics.devclad.com) and "Get a random user pic".
2. Use the URL in your app.

### Python Example

- `/api/getpic/` is the endpoint to get a random avatar.

``` python
def random_avatar():
    name = str(uuid.uuid4())[:8]
    with open(f"media/avatars/{name}.png", "wb+") as f:
        url = requests.get("https://userpics.devclad.com/api/getpic")
        response = requests.get(url.text, stream=True)
        if not response.ok:
            raise Exception("Could not get avatar")
        for block in response.iter_content(1024):
            if not block:
                break
            f.write(block)
    return f"avatars/{name}.png"
```

You can try svg too btw, haven't tested it but it should work.

## Config

``` go
accountId := os.Getenv("ACCOUNT_ID")
bucketName := os.Getenv("BUCKET_NAME")
accessKeyId := os.Getenv("API_ACCESS_KEY")
accessKeySecret := os.Getenv("API_SECRET_KEY")
```

### Replicate this

1. Create an R2 bucket on Cloudflare.
2. Generate S3 Token via `Manage R2 API Tokens` in R2 Dashboard.
3. Set your environment variables.
4. Deploy ⚡

### Running locally

do the usual. install dependencies via `yarn` and run `yarn run start`/`yarn run dev`.

**Make sure to setup environment variables in your Vercel dashboard.**
**Also make sure to have S3 API access and secret on the recieving end if your bucket is private like mine.**

### Services

| Resource | Service |
| --- | --- |
| Storage | Cloudflare R2 (S3 compatible) |
| Serverless Hosting | Vercel (AWS Lambda) |

---

### Todo

Check out the [issues](https://github.com/arthtyagi/serverless-userpics/issues) for more info.

#### YANKING

[template-go-vercel](https://github.com/riccardogiorato/template-go-vercel) was helpful while deploying.

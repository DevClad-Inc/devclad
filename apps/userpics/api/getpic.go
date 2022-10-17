package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"

	// "path/filepath"
	"sync"
	"time"

	// external
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	// "github.com/joho/godotenv"
)

type S3Response struct {
	Contents []struct {
		Key string `json:"Key"`
	} `json:"Contents"`
}

// uncomment some code to test locally

// func main() {
// 	GetPic()
// }

func GetPic(w http.ResponseWriter, _ *http.Request) {
	// err := godotenv.Load(filepath.Join("api/.env"))
	// fmt.Println("Loading .env file", err)
	// if err != nil { log.Fatal("Error loading .env file") }

	// ENV INITIALIZATION
	accountId := os.Getenv("ACCOUNT_ID")
	bucketName := os.Getenv("BUCKET_NAME")
	accessKeyId := os.Getenv("API_ACCESS_KEY")
	accessKeySecret := os.Getenv("API_SECRET_KEY")

	// === initialization shit ===

	// AWS CONFIGURATION (using V2 SDK - https://developers.cloudflare.com/r2/examples/aws-sdk-go/ gives a neat example btw)
	r2Resolver := aws.EndpointResolverWithOptionsFunc(
		func(service, region string, options ...interface{},
		) (aws.Endpoint, error) {
			return aws.Endpoint{
				URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId),
			}, nil
		})

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				accessKeyId, accessKeySecret, "",
			),
		),
	)
	if err != nil {
		log.Fatal(err)
	}

	client := s3.NewFromConfig(cfg)

	// test out
	// fmt.Println(ImageList(client, bucketName, accountId))

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		fmt.Fprintf(w, ImageList(client, bucketName, accountId))
		// ImageList(client, bucketName, accountId)
	}()

	wg.Wait()

}

func ImageList(client *s3.Client, bucketName string, _ string) string {
	publicId := os.Getenv("PUBLIC_ID")
	// LIST OF IMAGES
	// (https://developers.cloudflare.com/r2/data-access/s3-api/api/#implemented-object-level-operations/) has list of available operations

	input := &s3.ListObjectsV2Input{
		Bucket: aws.String(bucketName),
	}

	result, err := client.ListObjectsV2(context.TODO(), input)
	if err != nil {
		log.Fatal(err)
	}

	// RESPONSE HANDLING

	var s3Response S3Response
	jsonString, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(jsonString, &s3Response)

	// i have to use time as a source?! lol python is better hAhAhA (ofc not wtf)
	goddamnSource := rand.NewSource(time.Now().UnixNano())
	r := rand.New(goddamnSource)
	randomNumber := r.Intn(len(s3Response.Contents))
	randomImage := s3Response.Contents[randomNumber].Key
	generatedURl := fmt.Sprintf("https://%s.r2.dev/%s", publicId, randomImage)
	return generatedURl
}

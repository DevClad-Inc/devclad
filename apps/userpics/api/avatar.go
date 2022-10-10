package handler

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"sync"
)

type BoringParams struct {
	size int
	name string
	variant string
}

func Boring (w http.ResponseWriter, r *http.Request) {

	base_url := "https://source.boringavatars.com/"

	// default values
	size := 128
	name := "Cactus Jack"
	variant := "beam"

	stream := false

	if r.URL.Query().Get("size") != "" {
		s, err := strconv.Atoi(r.URL.Query().Get("size"))
		if err != nil {
			log.Fatal(err)
		} else {
			size = s
		}
	}
	if r.URL.Query().Get("name") != "" {
		name = r.URL.Query().Get("name")
	}
	if r.URL.Query().Get("variant") != "" {
		variant = r.URL.Query().Get("variant")
	}

	if r.URL.Query().Get("stream") != "" {
		stream = true
	}

	// todo: add color support
	params := BoringParams{
		size: size,
		name: name,
		variant: variant,
	}
	// why a waitgroup? cause fuck you, i like goroutines
	wg := sync.WaitGroup{}
	wg.Add(1)

	go func() {
		defer wg.Done()
		if stream {
			// display the image
			StreamBoringPic(w, r, FetchBoring(params, base_url))
		} else {
			fmt.Fprintln(w, "URL:", FetchBoring(params, base_url))
			fmt.Fprintf(w, "Query Params: size=%d, name=%s, variant=%s, stream=%t", size, name, variant, stream)
		}
	}()

	wg.Wait()

}

func FetchBoring (params BoringParams, base_url string) string {

	base_url += params.variant + "/" + strconv.Itoa(params.size) + "/" + params.name

	return base_url
}

func StreamBoringPic (w http.ResponseWriter, r *http.Request, url string) int64 {
	// download the image
	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}

	// stream the image
	w.Header().Set("Content-Type", "image/svg")

	res, err := io.Copy(w, resp.Body)

	if err != nil {
		log.Fatal(err)
	} else {
		return res
	}

	return res
}

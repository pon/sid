export const handleError = (response, isBlob) => {
  if (!response.ok) {
    return response.json()
    .then(json => {
      throw new Error(json.message);
    })
  }

  if (!isBlob) {
    return response.json().catch(err => ({}));
  } else {
    return response.blob().catch(err => ({}));
  }
}
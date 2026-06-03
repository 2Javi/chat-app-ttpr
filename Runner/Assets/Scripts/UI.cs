using UnityEngine;
using TMPro;

public class UI : MonoBehaviour
{

    [SerializeField] TextMeshProUGUI milesText;
    [SerializeField] GameObject endScreenText;
    MoveBike moveBikeReference;

    private void Start()
    {
        moveBikeReference = GetComponent<MoveBike>();
        endScreenText.SetActive(false);
    }

    private void Update()
    {
        milesText.text = "Miles Left " + moveBikeReference.milesLeft;
    }
}

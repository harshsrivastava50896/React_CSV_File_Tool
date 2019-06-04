import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./ConfirmModal.css";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none"
  }
}));

const SimpleModal = ({ remove, data, show, close, headers, processData }) => {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const classes = useStyles();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={show}
        onClose={close}>
        <div style={modalStyle} className={classes.paper}>
          {/* ------------------------------------------------------ */}
          <div className="Table">
            <div className="Title">
              <p>Updated List</p>
            </div>
            <div className="Heading">
              {headers.map((x) => {
                return (
                  <div className="Cell">
                    <p>{x}</p>
                  </div>
                );
              })}
              <div className="Cell">
                <p>Status</p>
              </div>
            </div>
            {data.map((x) => {
              return (
                <div className="Row">
                  <div className="Cell">
                    <p>{x.product.id}</p>
                  </div>
                  <div className="Cell">
                    <p>{x.product.name}</p>
                  </div>
                  <div className="Cell">
                    <p>{x.product.description}</p>
                  </div>

                  {x.updated ? (
                    <div className="Cell">
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}>
                        UPDATED
                      </Button>
                      <div
                        onClick={() => {
                          remove(x);
                        }}>
                        <IconButton
                          className={classes.button}
                          aria-label="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  ) : (
                    <div className="Cell">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}>
                        NOT UPDATED
                      </Button>
                      <div
                        onClick={() => {
                          remove(x);
                        }}>
                        <IconButton
                          className={classes.button}
                          aria-label="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div
            className="confirm_button"
            onClick={() => {
              processData();
            }}>
            <Button
              variant="contained"
              color="default"
              className={classes.button}>
              Process
              <CloudUploadIcon className={classes.rightIcon} />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SimpleModal;
